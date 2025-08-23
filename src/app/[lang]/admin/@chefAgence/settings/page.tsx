"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useUserStore } from "@/store/zustandStores";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ParamettresPage() {
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Ajoute ici la logique d'envoi/modification (API ou store)
    setOpen(false);
  };

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
                    <form className="space-y-4" onSubmit={handleEdit}>
                      <div>
                        <Label htmlFor="nom">Nom</Label>
                        <Input name="nom" value={editData.nom} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input name="prenom" value={editData.prenom} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" value={editData.email} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input name="telephone" value={editData.telephone} onChange={handleChange} />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit">Enregistrer</Button>
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
