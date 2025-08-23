import { z } from "zod";

export const caissierFormSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  email: z.string().email("Email invalide"),
  mot2passe: z.string().min(1, "Le mot de passe est requis").optional(), // optionnel pour l'édition
  agenceId: z.string().optional(), // optionnel pour l'édition
});

export type CaissierFormValues = z.infer<typeof caissierFormSchema>;

export const defaultValues: CaissierFormValues = {
  nom: "",
  prenom: "",
  username: "",
  telephone: "",
  email: "",
  mot2passe: "",
};
