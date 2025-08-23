import { z } from "zod";

// Schéma pour le signataire
export const SignataireSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  mail: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
  dateNaissance: z.string().min(1, "La date de naissance est requise"),
  lieuNaissance: z.string().min(1, "Le lieu de naissance est requis"),
});

export const EntrepriseSchema = z.object({
  id: z.string().optional(),
  gestionnaireId: z.string(),
  nomLegal: z.string().min(1, "Le nom légal est requis").max(255),
  raisonSociale: z.string().min(1, "La raison sociale est requise").max(255),
  adresse: z.string().min(1, "L'adresse est requise").max(255),
  email: z.string().email("Format d'email invalide").min(1, "L'email est requis").max(255),
  telephone: z.string().min(1, "Le téléphone est requis").max(20),
  numeroPatente: z.string().min(1, "Le numéro de patente est requis").max(50),
  numeroContribuable: z.string().min(1, "Le numéro de contribuable est requis").max(50),
  numeroRegistreCommerce: z.string().min(1, "Le numéro de registre de commerce est requis").max(50),
  numeroIdentificationFiscal: z.string().min(1, "Le NIF est requis").max(50),
  mot2passe: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(100),
  paysOrigine: z.string().min(1, "Le pays d'origine est requis"),
  signataire: SignataireSchema,
});

export type EntrepriseType = z.infer<typeof EntrepriseSchema>;
export type SignataireType = z.infer<typeof SignataireSchema>;
