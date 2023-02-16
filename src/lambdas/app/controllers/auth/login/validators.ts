import { z } from "zod";

const AnonUserPayload = z.object({
  type: z.literal("anon"),
  name: z.string().min(1).max(20),
});
const GoogleUserPayload = z.object({
  type: z.literal("google"),
  idToken: z
    .string()
    .min(1)
    .regex(/([^.]+?\.){2}[^.]+$/),
});

const AuthLoginBodyValidator = z.discriminatedUnion("type", [
  AnonUserPayload,
  GoogleUserPayload,
]);

export default AuthLoginBodyValidator;
