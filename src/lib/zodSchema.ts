import { z } from "zod";


export const LoginformSchema = z.object({ "email": z.string().email().min(1).max(255), "password": z.string().min(8).max(255) })

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

//27/04/2025

export const addClientFormShema = z.object({
    adresse: z.string(),
    dateNaissance: z.string(),
    email: z.string().email(),
    gestionnaireId: z.string(),
    lieuNaissance: z.string(),
    mot2passe: z.string(),
    nationalite: z.string(),
    nom: z.string(),
    numeroCni: z.string(),
    prenom: z.string(),
    sexe: z.enum(["MASCULIN", "FEMININ"]),
    telephone: z.string(),
})

export type TypeAddClientFormShema = z.infer<typeof addClientFormShema>;

export const clientContractFormSchema = z.object({
    gestionnaireId: z.string(),
    nom: z.string(),
    prenom: z.string(),
    dateNaissance: z.string(),
    lieuNaissance: z.string(),
    adresse: z.string(),
    email: z.string().email(),
    telephone: z.string(),
    numeroCni: z.string(),
    sexe: z.enum(["MASCULIN", "FEMININ"]),
    nationalite: z.string(),
    mot2passe: z.string(),
});

export const signataireContractFormSchema = z.object({
    nom: z.string(),
    prenom: z.string(),
    telephone: z.string(),
    lienClient: z.string(),
});
export type TypeSignataireContractFormSchema = z.infer<typeof signataireContractFormSchema>

export const beneficiaireContractFormSchema = z.object({
    nom: z.string(),
    prenom: z.string(),
    telephone: z.string(),
    lienClient: z.string(),
    adresse: z.string(),
    dateNaissance: z.string(),
    lieuNaissance: z.string(),
    quotePart: z.number(),
    montant: z.number(),
});
export type TypeBeneficiaireContractFormSchema = z.infer<typeof beneficiaireContractFormSchema>

export const generalContractFormSchema = z.object({
    clientDtoIn: clientContractFormSchema,
    agenceId: z.string(),
    typeCompte: z.enum(["PARTICULIER", "ENTREPRISE"]),
    typeContratId: z.string(),
    description: z.string(),
    typeVersement: z.enum(["MENSUEL", "TRIMESTRIEL", "ANNUEL"]),
    montantVersementInitial: z.number(),
    montantVersementPeriodique: z.number(),
    signataireDtoIn: z.array(signataireContractFormSchema),
    beneficiaireDtoIn: z.array(beneficiaireContractFormSchema),
});
export type TypeGeneralContractFormSchema = z.infer<typeof generalContractFormSchema>