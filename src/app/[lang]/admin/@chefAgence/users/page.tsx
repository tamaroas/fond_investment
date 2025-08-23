"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, Loader2, Plus, UserCog } from "lucide-react";
import { useChefAgence } from "@/hooks/use-chef-agence";
import { useUserStore } from "@/store/zustandStores";
import Link from "next/link";
import { Langs } from "@/utils/langs-config";
import { useRouter } from "next/navigation";

function ChefAgenceUsersPage({ params }: { params: { lang: Langs } }) {
  const { user } = useUserStore();
  const router = useRouter();
  const agenceId = user?.agenceId || "1";

  const {
    users,
    isUsersLoading,
    toggleUserStatus,
    isToggling
  } = useChefAgence(agenceId);

  const handleToggleUserStatus = (userId: string, newStatus: boolean) => {
    toggleUserStatus({ userId, status: !newStatus });
  };

  if (isUsersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const gestionnaires = users?.filter(u => u.role === 'GESTIONNAIRE') || [];
  const caissiers = users?.filter(u => u.role === 'CAISSIER') || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs - Agence</h1>
        <div className="flex gap-2">
          <Link href={`/${params.lang}/admin/users/gestionnaire`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Gestionnaire
            </Button>
          </Link>
          <Link href={`/${params.lang}/admin/users/caissier`}>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Caissier
            </Button>
          </Link>
        </div>
      </div>

      {/* Gestionnaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-6 w-6" />
            Gestionnaires ({gestionnaires.length})
          </CardTitle>
          <CardDescription>
            Les gestionnaires peuvent gérer les clients et effectuer des transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gestionnaires.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun gestionnaire dans cette agence</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gestionnaires.map((gestionnaire) => (
                  <TableRow key={gestionnaire.id}>
                    <TableCell className="font-medium">
                      {gestionnaire.prenom} {gestionnaire.nom}
                    </TableCell>
                    <TableCell>{gestionnaire.email}</TableCell>
                    <TableCell>
                      <Badge variant="success">
                        Actif
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date().toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleToggleUserStatus(gestionnaire.id, true)}
                        disabled={isToggling}
                        className="flex items-center gap-1"
                      >
                        <UserX className="h-4 w-4" />
                        Désactiver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Caissiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Caissiers ({caissiers.length})
          </CardTitle>
          <CardDescription>
            Les caissiers peuvent effectuer des transactions de base
          </CardDescription>
        </CardHeader>
        <CardContent>
          {caissiers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun caissier dans cette agence</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caissiers.map((caissier) => (
                  <TableRow key={caissier.id}>
                    <TableCell className="font-medium">
                      {caissier.prenom} {caissier.nom}
                    </TableCell>
                    <TableCell>{caissier.email}</TableCell>
                    <TableCell>
                      <Badge variant="success">
                        Actif
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date().toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleToggleUserStatus(caissier.id, true)}
                        disabled={isToggling}
                        className="flex items-center gap-1"
                      >
                        <UserX className="h-4 w-4" />
                        Désactiver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ChefAgenceUsersPage;
