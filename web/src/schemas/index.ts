import * as z from 'zod';
export const SkillEnum = z.enum([
  "PROGRAMMING",
  "DESIGN",
  "WRITING",
  "MARKETING",
  "MUSIC",
  "COOKING",
  "PUBLIC_SPEAKING",
  "VIDEO_EDITING",
  "DATA_ANALYSIS"
]);

export const AvailabilityEnum = z.enum([
  "WEEKDAYS",
  "WEEKENDS",
  "ALL_WEEK"
]);
export const LoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' })
})
export const SignupSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})
export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    })
})
export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required"
    })
})
export const UserRoleEnum = z.enum(["USER", "ADMIN"]); 

// Define User Schema
export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable().optional(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
  role: UserRoleEnum.default("USER"),
  skillsWanted: z.array(SkillEnum).default([]),
  skillsOffered: z.array(SkillEnum).default([]),
  availability: AvailabilityEnum.optional(),
});