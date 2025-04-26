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
});

export type UserClientType = z.infer<typeof UserClientSchema>;