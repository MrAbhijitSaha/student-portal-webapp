import z from "zod";

export const studentLoginSchema = z.object({
  studentId: z
    .string()
    .min(8, {
      error: "The Student Id  isn't Valid",
    })
    .max(32, {
      error: "The Student Id  isn't Valid",
    }),

  password: z
    .string()
    .min(8, {
      error: "The password  is incorrect.",
    })
    .max(128, {
      error: "The password  is incorrect.",
    }),
});

export const onlineRegistrationFormSchema = z.object({
  fullName: z.string().trim().min(4, { error: "Fill your full name" }),
  fatherName: z.string().trim().min(4, { error: "Fill your father name" }),
  gender: z.string().min(1, { error: "Select Your Gender" }),
  dob: z
    .date({
      error: "Date of birth is required.",
    })
    .max(new Date(), {
      error: "Date of birth cannot be in the future.",
    }),
  emailId: z.email({ error: "Invalid email address" }),
  phoneNumber: z
    .string()
    .trim()
    .length(10, { error: "Inavlid contact number" }),
  whatsappNumber: z
    .string()
    .trim()
    .length(10, { error: "Inavlid contact number" }),

  Aadhaar: z
    .string()
    .trim()
    .regex(/^\d{12}$/, { error: "Invalid aadhaar number" }),
  lastQualification: z
    .string()
    .min(2, { error: "Fill Your Last Qualification" }),
  address: z
    .string()
    .trim()
    .min(10, {
      error:
        "Please enter your complete address with City, District, P.O. and PIN code.",
    })
    .max(250, {
      error: "Address must not exceed 250 characters.",
    }),

  course: z.string().min(1, { error: "Select your course" }),
  duration: z.string().min(1, { error: "Select your course duration" }),
  acceptTerms: z.boolean().refine((value) => value === true),
});
