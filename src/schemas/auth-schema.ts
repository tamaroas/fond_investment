import { z } from "zod";


export const LoginformSchema = z.object({ 
    login: z.string().min(1).max(255), 
    mot2passe: z.string().min(8).max(255) 
})
export type LoginformType = z.infer<typeof LoginformSchema>
export const RegisterformSchema = z.object({
    lastname: z.string().min(1).max(255),
    firstname: z.string().min(1).max(255),
    company: z.string().min(1).max(255),
    identityType: z.string(),
    email: z.string().email().min(1).max(255),
    phone: z.string().min(1).max(255).optional(),
    currency: z.string(),
    password: z.string().min(8).max(255),
    confirm_password: z.string().min(8).max(255).optional(),
    code: z.string().optional(),
    tel: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords don't match",
            path: ["confirm_password"],
        })
    }
})
