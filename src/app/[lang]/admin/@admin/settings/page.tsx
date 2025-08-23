"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/zustandStores";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginformSchema, UpdateProfileSchema, UpdateProfileType } from "@/schemas/auth-schema";
import { toast } from "@/components/ui/use-toast";

export default function ParamettresPage() {
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
  });


  const { mutateAsync: mutationUpdateProfile, isPending: isSubmitting } = useUpdateProfile();

  const handleEdit = async (data: UpdateProfileType) => {
    try {
      await mutationUpdateProfile(data);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
    },
  });

  useEffect(() => {
    if (user) {
      setEditData({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
      });
      reset({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        username: user.email,
      });
    }
  }, [user]);

  console.log(errors);
  return (
    <div className="max-w-2xl mx-5 py-8">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>


      <Tabs defaultValue="infos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="infos">Informations personnelles</TabsTrigger>
          <TabsTrigger value="securite">Sécurité</TabsTrigger>
        </TabsList>
        <TabsContent value="infos">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Informations personnelles </h2>
            {user ? (
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Nom :</span> {user.nom}
                </div>
                <div>
                  <span className="font-medium">Prénom :</span> {user.prenom}
                </div>
                <div>
                  <span className="font-medium">Email :</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">Téléphone :</span> {user.telephone}
                </div>
                <div>
                  <span className="font-medium">Rôle :</span> {user.role}
                </div>
                <div>
                  <span className="font-medium">ID :</span> {user.id}
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-4" variant="outline">Modifier</Button>
                  </DialogTrigger>
                  <DialogContent className=" bg-white p-4">
                    <DialogHeader>
                      <DialogTitle>Modifier mes informations</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleSubmit(handleEdit)}>
                      <div>
                        <Label htmlFor="nom">Nom</Label>
                        <Input id="nom" type="text" {...register("nom")} />
                        {errors.nom && <span className="text-xs text-red-500">{errors.nom?.message}</span>}
                      </div>
                      <div>
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input id="prenom" type="text" {...register("prenom")} />
                        {errors.prenom && <span className="text-xs text-red-500">{errors.prenom?.message}</span>}
                      </div>
                      <div>
                        <Label htmlFor="username">Nom d'utilisateur</Label>
                        <Input id="username" type="text" {...register("username")} />
                        {errors.username && <span className="text-xs text-red-500">{errors.username?.message}</span>}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                        {errors.email && <span className="text-xs text-red-500">{errors.email?.message}</span>}
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input id="telephone" type="text" {...register("telephone")} />
                        {errors.telephone && <span className="text-xs text-red-500">{errors.telephone?.message}</span>}
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "En cours..." : "Enregistrer"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <p className="text-gray-500">Aucune information utilisateur disponible.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="securite">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Changer le mot de passe</h2>
            {/* Formulaire de changement de mot de passe */}
            <ChangePasswordForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useChangePassword } from "@/hooks/use-change-password";
import { useUpdateProfile } from "@/hooks/use-auth";

function ChangePasswordForm() {
  const { mutate, status } = useChangePassword();
  const isLoading = status === "pending";
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ oldPassword, newPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="oldPassword">Ancien mot de passe</Label>
        <Input
          id="oldPassword"
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" isLoader={isLoading}>
        {isLoading ? "Changement..." : "Changer le mot de passe"}
      </Button>
    </form>
  );
}
