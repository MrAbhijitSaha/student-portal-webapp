import { serverEnv } from "@/lib/env/serverEnv";
import { admissionRateLimit } from "@/lib/rate-limit";
import { onlineRegistrationFormSchema } from "@/lib/zodSchema";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    // Get form data
    const data = await request.json();
    // const admissionData = await request.json();

    const parsed = onlineRegistrationFormSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid admission data.",
        },
        { status: 400 },
      );
    }

    const admissionData = parsed.data;

    const formData = new URLSearchParams();
    const { fullName, emailId } = data;

    if (!fullName || !emailId) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name and email are required.",
        },
        { status: 400 },
      );
    }

    // Get client IP
    const forwardedFor = request.headers.get("x-forwarded-for");

    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limit
    const { success, reset } = await admissionRateLimit.limit(
      `admission:${ip}`,
    );

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);

      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
          },
        },
      );
    }

    Object.entries(admissionData).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""));
    });

    const response = await fetch(serverEnv.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      redirect: "follow",
    });

    const result = await response.text();

    console.log("Google Apps Script response:", result);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Admission submission failed.",
        },
        { status: 502 },
      );
    }

    //Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: serverEnv.GMAIL_USER,
        pass: serverEnv.GMAIL_APP_PASSWORD,
      },
    });

    //Verify Gmail connection
    await transporter.verify();

    console.log("Gmail transporter is ready.");

    //Send email
    const info = await transporter.sendMail({
      from: `"Admission Office" <${serverEnv.GMAIL_USER}>`,
      to: emailId,
      subject: "Confirm your Admission Registration",

      html: `
<div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #1a1a1a; margin-bottom: 20px;">
    Registration Successfully Submitted
  </h2>

  <p style="margin-bottom: 16px;">
    Dear <strong>${fullName}</strong>,
  </p>

  <p style="margin-bottom: 16px;">
    Thank you for registering with <strong>Mars Academy</strong>.
  </p>

  <p style="margin-bottom: 16px;">
    We’re pleased to confirm that your registration request has been
    <strong>successfully submitted</strong>.
    Our admissions team will review your details and get in touch with you
    within <strong>48 hours</strong> regarding the next steps.
  </p>

  <p style="margin-bottom: 16px;">
    If you have any questions or need assistance in the meantime,
    please feel free to contact us at
    <strong>+91 8017564029</strong>.
    You can also simply reply to this email, and our team will be happy to assist you.
  </p>

  <p style="margin-bottom: 16px;">
    If you did not submit this registration request, please let our team
    know when we contact you, or reply to this email to inform us.
  </p>

  <p style="margin-top: 30px;">
    Best regards,<br>
    <strong>Mars Academy</strong>
  </p>

</div>
      `,
    });

    console.log("Email sent:", info.messageId);

    // 8. Return success
    return NextResponse.json(
      {
        success: true,
        message: "Admission data saved and email sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admission API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process admission and send email.",
      },
      { status: 500 },
    );
  }
}
