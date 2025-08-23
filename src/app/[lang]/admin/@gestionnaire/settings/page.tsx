"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useUserStore } from "@/store/zustandStores";

export default function ParamettresPage() {
  const { user } = useUserStore();
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
            <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
