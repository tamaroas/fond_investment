import { z } from "zod";


export const LoginformSchema = z.object({ "login": z.string().email().min(1).max(255), "mot2passe": z.string().min(8).max(255) })

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

export const ProfileformSchema = z.object({
    old_password: z.string().min(8).max(255),
    new_password: z.string().min(8).max(255),
    confirm_password: z.string().min(8).max(255).optional(),
}).superRefine((data, ctx) => {
    if (data.new_password !== data.confirm_password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords don't match",
            path: ["confirm_password"],
        })
    }
})

export const EditformUserSchema = z.object({
    lastname: z.string().min(1).max(255),
    firstname: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
})

export const EditformSetting = z.object({
    name: z.string().min(1).max(255),
    value: z.string().min(1).max(255)
})

export const WithdrawalMethodOmformSchema = z.object({
    id_withdrawal_method: z.number().min(1),
    full_name: z.string().min(1).max(255),
    country_code: z.string().min(1).max(6),
    tel: z.string().min(1).max(9),
    password: z.string().min(8).max(255).optional(),
})

export const WithdrawalMethodMomoformSchema = z.object({
    id_withdrawal_method: z.number().min(1),
    full_name: z.string().min(1).max(255),
    country_code: z.string().min(1).max(6),
    tel: z.string().min(1).max(9),
    password: z.string().min(8).max(255).optional(),
})

export const WithdrawalMethodBankformSchema = z.object({
    id_withdrawal_method: z.number().min(1),
    bank_name: z.string().min(1).max(255),
    full_name: z.string().min(1).max(255),
    bank_number: z.string().min(5).max(255),
    bank_iban: z.string().min(5).max(255),
    bank_swift: z.string().min(5).max(255),
    password: z.string().min(8).max(255).optional(),
})

export const InitializeWithdrawalformSchema = z.object({
    id_withdrawal: z.string().min(1).max(255),
    amount: z.string()
        .transform((val) => parseFloat(val)),
    password: z.string().min(8).max(255).optional(),
})

export const AddWithdrawalMethodformSchema = z.object({
    companyid_withdrawal_method: z.number().min(1),
    full_name: z.string().min(5),
    password: z.string().min(8),
    tel: z.string().min(9),
    bank_number: z.string().min(4),
    bank_iban: z.string().min(10),
    bank_swift: z.string().min(10),
})

export const ValidateWithdrawalformSchema = z.object({
    id_payment_method: z.string().min(1),
    password: z.string().min(8).max(255).optional(),
})


export const ChefAgenceFormSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z.string().min(1, "Le prénom est requis"),
    username: z.string().min(1, "Le username est requis"),
    telephone: z.string().min(8, "Le téléphone est requis").max(20),
    email: z.string().email("Email invalide").min(1, "L'email est requis"),
    mot2passe: z.string().min(8, "Mot de passe trop court").max(255).optional(),
    agenceId: z.string().min(1, "L'agence est requise"),
});

export type ChefAgenceFormType = z.infer<typeof ChefAgenceFormSchema>;
