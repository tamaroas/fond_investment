import { z } from "zod";

export const UserClientSchema = z.object({
  id: z.string().optional(),
  gestionnaireId: z.string(),
  nom: z.string().min(1).max(255),
  prenom: z.string().min(1).max(255),
  dateNaissance: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Format YYYY-MM-DD
  lieuNaissance: z.string().min(1).max(255),
  adresse: z.string().min(1).max(255),
  email: z.string().email().min(1).max(255),
  telephone: z.string().min(1).max(20),
  numeroCni: z.string().min(1).max(50),
  sexe: z.enum(["MASCULIN", "FEMININ"]),
  nationalite: z.string().min(1).max(100),
  nbreCompte: z.number().optional(),
});

export type UserClientType = z.infer<typeof UserClientSchema>;

export const CompteSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().min(1, "L'ID du client est requis"),
  gestionnaireId: z.string().min(1, "L'ID du gestionnaire est requis"),
  agenceId: z.string().min(1, "L'ID de l'agence est requis"),
  typeCompte: z.enum(["PARTICULIER", "COURANT", "ENTREPRISE"], {
    errorMap: () => ({ message: "Le type de compte doit être PARTICULIER, COURANT ou ENTREPRISE" }),
  }),
  montantPremierVersement: z.number().min(0, "Le montant du premier versement doit être positif"),
  numeroCompte: z.string().optional(),
  solde: z.number().optional(),
  dateCreation: z.string().optional(),
  cle: z.string().optional(),
  codeAgence: z.string().optional(),
  dateOuvertureCompte: z.string().optional(),
});

export type CompteType = z.infer<typeof CompteSchema>;

export const AffiliationSchema = z.object({
  id: z.string().optional(),
  nom: z.string().min(1, "Le nom est requis"),
  relation: z.string().min(1, "La relation est requise"),
  contact: z.string().min(1, "Le contact est requis"),
});

export type AffiliationType = z.infer<typeof AffiliationSchema>;
