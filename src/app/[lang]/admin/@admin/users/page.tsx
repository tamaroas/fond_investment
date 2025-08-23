"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UsersHomePage() {
  const router = useRouter();
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Gestion des utilisateurs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card onClick={() => router.push("/admin/users/chef-agence")} className=" cursor-pointer">
          <CardHeader className="flex flex-row items-center gap-4">
            <Users className="h-8 w-8 text-green-600" />
            <CardTitle>Chef d'agence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Créez, modifiez et gérez les chefs d'agence de vos agences.</p>

          </CardContent>
        </Card>
        <Card onClick={() => router.push("/admin/users/gestionnaire")} className=" cursor-pointer">
          <CardHeader className="flex flex-row items-center gap-4">
            <UserCog className="h-8 w-8 text-blue-600" />
            <CardTitle>Gestionnaires</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Créez, modifiez et gérez l'ensemble des gestionnaires de la plateforme.</p>

          </CardContent>
        </Card>
        <Card onClick={() => router.push("/admin/users/caissier")} className=" cursor-pointer">
          <CardHeader className="flex flex-row items-center gap-4">
            <Users className="h-8 w-8 text-green-600" />
            <CardTitle>Caissiers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Créez, modifiez et gérez les caissiers de vos agences.</p>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
