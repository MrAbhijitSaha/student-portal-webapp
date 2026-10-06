import { serverEnv } from "@/lib/env/serverEnv";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const userFormData = await request.json();

    const {
      fullName,
      fatherName,
      gender,
      dob,
      emailId,
      phoneNumber,
      whatsappNumber,
      Aadhaar,
      lastQualification,
      address,
      course,
      duration,
      acceptTerms,
    } = userFormData;

    if (
      !fullName ||
      !emailId ||
      !fatherName ||
      !gender ||
      !dob ||
      !phoneNumber ||
      !whatsappNumber ||
      !Aadhaar ||
      !address ||
      !lastQualification ||
      !course ||
      !duration ||
      !acceptTerms
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please Fill all fields correctley.",
        },
        { status: 400 },
      );
    }

    console.log(userFormData);

    const response = await fetch(serverEnv.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userFormData),
      redirect: "follow",
    });

    console.log(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Admission submission failed.",
        },
        { status: 502 },
      );
    }

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

    return NextResponse.json(
      {
        success: true,
        message: "Admission data saved and email sent.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process admission and send email.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const response = await fetch(serverEnv.GOOGLE_SCRIPT_URL_READ, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch admission data.",
      },
      { status: 502 },
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}
