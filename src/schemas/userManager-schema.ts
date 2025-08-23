import { z } from "zod";

export const managerFormSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  email: z.string().email("Email invalide"),
  agenceId: z.string().min(1, "L'agence est requise"),
  mot2passe: z.string().optional(),
});

export type ManagerFormValues = z.infer<typeof managerFormSchema>;

export const defaultValues: ManagerFormValues = {
  nom: "",
  prenom: "",
  username: "",
  telephone: "",
  email: "",
  agenceId: "",

};
