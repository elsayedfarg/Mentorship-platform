import { z } from "zod";

export const mentorProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name is required (at least 2 characters)"),
  title: z
    .string()
    .trim()
    .min(3, "Professional title is required (at least 3 characters)"),
  bio: z
    .string()
    .trim()
    .min(10, "Bio is required (at least 10 characters)"),
  hourly_rate: z
    .string()
    .min(1, "Hourly rate is required")
    .refine(
      (value) => Number(value) > 0,
      "Hourly rate must be a positive number",
    ),
});

export const studentProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name is required (at least 2 characters)"),
  experience: z.string().min(1, "Please select your experience level"),
  goals: z
    .string()
    .trim()
    .min(10, "Please describe your learning goals (at least 10 characters)"),
  interests: z
    .array(z.string())
    .min(1, "Please select at least one interest"),
});

export const studentStepFields = {
  1: ["name"],
  2: ["experience", "goals"],
  3: ["interests"],
};
