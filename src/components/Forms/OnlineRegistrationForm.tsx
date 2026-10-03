"use client";

import { courseList, duration } from "@/lib/infromation";
import { OnlineRegistrationFormSchemaType } from "@/lib/types";
import { onlineRegistrationFormSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import ky from "ky";
import { ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../shadcnui/button";
import { Calendar } from "../shadcnui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../shadcnui/card";
import { Checkbox } from "../shadcnui/checkbox";
import { Field, FieldError, FieldLabel } from "../shadcnui/field";
import { Input } from "../shadcnui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcnui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcnui/select";
import { Spinner } from "../shadcnui/spinner";
import { Textarea } from "../shadcnui/textarea";
import { toast } from "../shadcnui/toast";

const OnlineRegistrationForm = () => {
  const [open, setOpen] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<OnlineRegistrationFormSchemaType>({
    resolver: zodResolver(onlineRegistrationFormSchema),
    defaultValues: {
      fullName: "",
      fatherName: "",
      gender: "",
      dob: undefined,
      emailId: "",
      phoneNumber: "",
      whatsappNumber: "",
      Aadhaar: "",
      lastQualification: "",
      address: "",
      course: "",
      acceptTerms: false,
      duration: "",
    },

    mode: "onSubmit",
  });

  const sendAddmissonData = async (sData: OnlineRegistrationFormSchemaType) => {
    try {
      const admissionData = {
        ...sData,
        fullName: sData.fullName,
        fatherName: sData.fatherName,
        gender: sData.gender,
        dob: format(sData.dob, "dd/MM/yyyy"),
        emailId: sData.emailId,
        phoneNumber: sData.phoneNumber,
        whatsappNumber: sData.whatsappNumber,
        Aadhaar: sData.Aadhaar,
        lastQualification: sData.lastQualification,
        address: sData.address,
        course: sData.course,
        duration: sData.duration,
        acceptTerms: sData.acceptTerms,
      };

      const { message, success } = await ky
        .post("/api/admission", {
          json: admissionData,
        })
        .json<{
          success: boolean;
          message: string;
        }>();

      if (!success) {
        throw new Error(message);
      }

      setFormSubmit(true);

      if (!admissionData) {
        toast.add({
          type: "error",
          description: message,
        });
      } else {
        toast.add({
          type: "success",
          description: message,
        });

        reset();
      }
    } catch (error) {
      toast.add({
        type: "error",
        description: "message",
      });

      console.error(error);
    }
  };

  return (
    <Card className="h-auto border-0 bg-white shadow-lg outline-none xl:min-h-200">
      <CardContent className="text-left">
        {formSubmit ?
          <div className="space-y-6 py-16 text-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">
                Registration Submitted Successfully
              </h2>
              <p className="text-muted-foreground mt-2">
                Thank you for choosing Mars Academy. We have successfully
                received your registration details.
              </p>
            </div>
            <div className="rounded-xl border p-4 text-left">
              <p className="font-semibold">What happens next?</p>
              <p className="text-muted-foreground mt-2 text-sm">
                Please wait for 1–2 working days. Our team will review your
                registration and contact you shortly to confirm your admission
                and provide you with the next steps.
              </p>
            </div>
            <div className="rounded-xl border p-4 text-left">
              <p className="font-semibold">Have any questions?</p>
              <p className="text-muted-foreground mt-2 text-sm">
                If you have any questions about our courses, admission process,
                fees, or class schedule, feel free to contact us.
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-muted-foreground text-sm">WhatsApp</p>
                  <p className="font-medium">7003398110</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm">Mobile</p>
                  <p className="font-medium">8017564029</p>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Please keep your phone and WhatsApp numbers active so our team can
              reach you without any difficulty.
            </p>
          </div>
        : <form
            onSubmit={handleSubmit(sendAddmissonData)}
            className="space-y-5"
            noValidate>
            {/* basic details section  */}
            <div className="space-y-3">
              <CardTitle className="text-xl">Basic Details</CardTitle>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <Input
                        type="text"
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Name"
                        className="h-12"
                        autoComplete="name"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="fatherName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Father&apos;s Name
                      </FieldLabel>
                      <Input
                        type="text"
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Father's Name"
                        autoComplete="off"
                        className="h-12"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="gender"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}>
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          className="min-w-30 py-5.5 capitalize">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="dob"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Date Of Birth
                      </FieldLabel>

                      <Popover
                        open={open}
                        onOpenChange={setOpen}>
                        <PopoverTrigger
                          className={`${field.value ? "text-black hover:text-black" : "hover:text-muted-foreground"} bg-transparent hover:bg-transparent`}

                          render={
                            <Button
                              id={field.name}
                              type="button"
                              variant="outline"
                              className="text-muted-foreground h-12 w-full justify-start font-normal"
                              aria-invalid={fieldState.invalid}>
                              {field.value ?
                                format(field.value, "dd/MM/yyyy")
                              : "Dob"}
                            </Button>
                          }
                        />

                        <PopoverContent
                          className="w-auto p-0"
                          align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setOpen(false);
                            }}
                            disabled={(date) => date > new Date()}
                            captionLayout="dropdown"
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="emailId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Email Address
                      </FieldLabel>
                      <Input
                        type="email"
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Email Address"
                        autoComplete="email"
                        className="h-12"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Contact Number
                      </FieldLabel>
                      <Input
                        type="tel"
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Contact number"
                        autoComplete="tel"
                        className="h-12"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="whatsappNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        What&apos;s App Number
                      </FieldLabel>
                      <Input
                        type="tel"
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Whats App number"
                        autoComplete="tel"
                        className="h-12"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="Aadhaar"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Aadhaar Number
                      </FieldLabel>
                      <Input
                        type="number"
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Aadhaar number"
                        autoComplete=""
                        className="h-12"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="lastQualification"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Last Qualification
                      </FieldLabel>
                      <Input
                        type="text"
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Qualification"
                        autoComplete="off"
                        className="h-12"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="address"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="md:col-span-2 lg:col-span-3">
                      <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Address"
                        autoComplete="street-address"
                        className="h-32"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            {/* select course section  */}
            <div className="space-y-2 pb-2">
              <CardTitle className="text-xl">Course Deatils</CardTitle>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="course"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Course</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}>
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          className="min-w-30 py-5.5 capitalize">
                          <SelectValue placeholder="Select your course " />
                        </SelectTrigger>
                        <SelectContent>
                          {courseList.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.subject}
                              className="capitalize">
                              {item.subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="duration"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Course type</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}>
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          className="min-w-30 py-5.5 capitalize">
                          <SelectValue placeholder="Select your course duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {duration.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.value}
                              className="capitalize">
                              {item.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <Controller
              name="acceptTerms"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  orientation="horizontal"
                  className="flex items-start justify-start space-x-1">
                  <Checkbox
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                    }}
                  />
                  <FieldLabel htmlFor={field.name}>
                    I confirm that the information provided is accurate and
                    agree to follow all Mars Academy rules and policies.
                  </FieldLabel>
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full">
              {isSubmitting ?
                <Spinner />
              : "Regsiter"}
            </Button>
          </form>
        }
        {!isSubmitSuccessful && (
          <CardDescription className="flex items-center justify-center gap-2 lg:hidden xl:flex">
            <ShieldCheckIcon />
            Your information is secure and protected.
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
};

export default OnlineRegistrationForm;
