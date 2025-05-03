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
  hasCompte: z.boolean().optional(),
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

export const SignataireSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  lienClient: z.string().min(1, "Le lien avec le client est requis"),
});

export type SignataireType = z.infer<typeof SignataireSchema>;

export const BeneficiaireSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  lienClient: z.string().min(1, "Le lien avec le client est requis"),
  adresse: z.string().min(1, "L'adresse est requise"),
  dateNaissance: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  lieuNaissance: z.string().min(1, "Le lieu de naissance est requis"),
  quotePart: z.number().min(0, "La quote-part doit être un nombre positif"),
  montant: z.number().min(0, "Le montant doit être un nombre positif"),
});

export type BeneficiaireType = z.infer<typeof BeneficiaireSchema>;

export const AffiliationSchema = z.object({
  id: z.string().optional(),
  compteId: z.string().min(1, "L'ID du compte est requis"),
  typeContratId: z.string().min(1, "L'ID du type de contrat est requis"),
  description: z.string().min(1, "La description est requise"),
  montantVersementEncompte: z.boolean(),
  typeVersement: z.enum(["MENSUEL", "TRIMESTRIEL", "SEMESTRIEL", "ANNUEL"], {
    errorMap: () => ({ message: "Le type de versement doit être MENSUEL, TRIMESTRIEL, SEMESTRIEL ou ANNUEL" }),
  }),
  montantVersementInitial: z.number().min(0, "Le montant du versement initial doit être positif"),
  montantVersementPeriodique: z.number().min(0, "Le montant du versement périodique doit être positif"),
  signataireDtoIn: z.array(SignataireSchema).optional(),
  beneficiaireDtoIn: z.array(BeneficiaireSchema).optional(),
  origineFond: z.string().min(1, "L'origine des fonds est requise"),
});

export type AffiliationType = z.infer<typeof AffiliationSchema>;


export type TypeContratType = {
  publicId: string;
  nom: string;
  description: string;
  duree: number;
  dureeRenouvellement: number;
  tauxInteret: number;
  fraisOuverture: number;
  fraisCloture: number;
  fraisRenouvellement: number;
  fraisVersement: number;
  fraisRetrait: number;
  fraisFiscalite: number;
  tauxFraisGestion: number;
  montantMinVersement: number | null;
  montantMaxVersement: number | null;
  montantRetraitMax: number | null;
  fraisRetraitAvantEcheance: number;
  typeVersement: string;
  hasBeneficiare: boolean;
  hasSignataires: boolean;
  renouvelable: boolean;
}