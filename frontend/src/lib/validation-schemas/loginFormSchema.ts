import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email({ message: "Incorrect email" }),
  password: z
    .string()
    .min(4, { message: "Password has to have min. 6 characters" }),
});
