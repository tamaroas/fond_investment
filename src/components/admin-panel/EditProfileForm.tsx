"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

export type EditProfileFormValues = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
};

export function EditProfileForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues: EditProfileFormValues;
  onSubmit: (values: EditProfileFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({ defaultValues });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="nom">Nom</Label>
        <Input id="nom" {...register("nom", { required: "Le nom est requis" })} />
        {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
      </div>
      <div>
        <Label htmlFor="prenom">Prénom</Label>
        <Input id="prenom" {...register("prenom", { required: "Le prénom est requis" })} />
        {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email", { required: "L'email est requis" })} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="telephone">Téléphone</Label>
        <Input id="telephone" {...register("telephone", { required: "Le téléphone est requis" })} />
        {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Annuler</Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </DialogFooter>
    </form>
  );
}
