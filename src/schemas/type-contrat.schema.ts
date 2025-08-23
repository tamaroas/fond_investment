import { z } from "zod";

export const typeContratSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  duree: z.number().optional(),
  dureeRenouvellement: z.number().optional(),
  tauxInteret: z.number().optional(),
  fraisOuverture: z.number().optional(),
  fraisCloture: z.number().optional(),
  fraisRenouvellement: z.number().optional(),
  fraisRetrait: z.number().optional(),
  fraisFiscalite: z.number().optional(),
  fraisVersement: z.number().optional(),
  tauxFraisGestion: z.number().optional(),
  montantMinVersement: z.number().optional(),
  montantMaxVersement: z.number().optional(),
  montantRetraitMax: z.number().optional(),
  hasBeneficiares: z.boolean().optional(),
  hasSignataires: z.boolean().optional(),
  penaliteRetraitAvantEcheance: z.number().optional(),
  typeVersement: z.enum(["MENSUEL", "TRIMESTRIEL", "SEMESTRIEL", "ANNUEL"]),
  type: z.enum(["EPARGNE", "INVESTISSEMENT"]),
  renouvelable: z.boolean(),
  publicId: z.string().optional(),

});

export type TypeContrat = z.infer<typeof typeContratSchema>;
