"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, UserCog, CreditCard, Settings, BarChart3, Wallet, TrendingUp, TrendingDown, UserCheck, UserX, Loader2, PiggyBank } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";
import { useEffect, useState } from "react";
import { BreadcrumbCustom } from "@/components/ui/breadcrumb";
import { useChefAgence } from "@/hooks/use-chef-agence";
import { useUserStore } from "@/store/zustandStores";
import useManagers from "@/hooks/useManagers";
import useCaissiers from "@/hooks/useCaissiers";

function ChefAgencePage({ params }: { params: { lang: Langs } }) {
  const [dictionary, setDictionary] = useState<any>({});
  const [options_bread, setOptionsBread] = useState<any[]>([]);
  const { user } = useUserStore();
  const agenceId = user?.agenceId || "1"; // Fallback pour les tests

  const {
    stats,
    isStatsLoading,
    users,
    isUsersLoading,
    toggleUserStatus,
    isToggling
  } = useChefAgence(agenceId);

  // Récupérer les vrais gestionnaires et caissiers
  const { managers, loading: managersLoading } = useManagers({ agencyId: agenceId });
  const { caissiers, loading: cashiersLoading } = useCaissiers({ agencyId: agenceId });

  // Charger le dictionnaire pour les traductions
  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(params.lang);
      setDictionary(dict);

      setOptionsBread([
        {
          path: undefined,
          label: dict.dashboard || "Dashboard Chef d'Agence"
        }
      ]);
    };

    loadDictionary();
  }, [params.lang]);

  const handleToggleUserStatus = (userId: string, newStatus: boolean) => {
    toggleUserStatus({ userId, status: !newStatus });
  };

  if (isStatsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Chef d'Agence</h1>
        </div>
      </div>

      {/* Statistiques de l'agence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <CreditCard className="h-5 w-5" />
              Comptes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-800">{stats?.nombreComptes || 0}</p>
            <p className="text-sm text-blue-600">Nombre total de comptes</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <BarChart3 className="h-5 w-5" />
              Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-800">{stats?.nombrePlans || 0}</p>
            <p className="text-sm text-green-600">Plans souscrits</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Wallet className="h-5 w-5" />
              Soldes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-800">
              {stats?.totalSoldes?.toLocaleString().replace(/\s/g, ' ') || 0} FCFA
            </p>
            <p className="text-sm text-purple-600">Total des soldes</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
              Dépôts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-800">
              {stats?.totalDepots?.toLocaleString().replace(/\s/g, ' ') || 0} FCFA
            </p>
            <p className="text-sm text-emerald-600">Total des dépôts</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <TrendingDown className="h-5 w-5" />
              Retraits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-800">
              {stats?.totalRetraits?.toLocaleString().replace(/\s/g, ' ') || 0} FCFA
            </p>
            <p className="text-sm text-red-600">Total des retraits</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <PiggyBank className="h-5 w-5" />
              Solde Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-800">
              {stats?.totalSoldes?.toLocaleString().replace(/\s/g, ' ') || 0} FCFA
            </p>
            <p className="text-sm text-orange-600">Solde des plans souscrits</p>
          </CardContent>
        </Card>
      </div>

      {/* Gestion des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Équipe de l'Agence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Gestionnaires */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserCog className="h-5 w-5" />
                  Gestionnaires
                </h3>
                <Link href={`/${params.lang}/admin/users/gestionnaire`}>
                  <Button variant="outline" size="sm">
                    Gérer les Gestionnaires
                  </Button>
                </Link>
              </div>
              
              {managersLoading ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {managers?.length || 0} gestionnaire(s) dans cette agence
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {managers?.slice(0, 3).map((gestionnaire) => (
                      <div key={gestionnaire.id} className="bg-white p-3 rounded border flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{gestionnaire.prenom} {gestionnaire.nom}</p>
                          <p className="text-xs text-gray-500">{gestionnaire.email}</p>
                        </div>
                        <Badge variant="default" className="text-xs">Actif</Badge>
                      </div>
                    )) || []}
                  </div>
                  {(managers?.length || 0) > 3 && (
                    <p className="text-xs text-gray-500 mt-2">
                      +{(managers?.length || 0) - 3} autre(s)...
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Caissiers */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Caissiers
                </h3>
                <Link href={`/${params.lang}/admin/users/caissier`}>
                  <Button variant="outline" size="sm">
                    Gérer les Caissiers
                  </Button>
                </Link>
              </div>
              
              {cashiersLoading ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {caissiers?.length || 0} caissier(s) dans cette agence
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {caissiers?.slice(0, 3).map((caissier) => (
                      <div key={caissier.id} className="bg-white p-3 rounded border flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{caissier.prenom} {caissier.nom}</p>
                          <p className="text-xs text-gray-500">{caissier.email}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">Actif</Badge>
                      </div>
                    )) || []}
                  </div>
                  {(caissiers?.length || 0) > 3 && (
                    <p className="text-xs text-gray-500 mt-2">
                      +{(caissiers?.length || 0) - 3} autre(s)...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

export default ChefAgencePage;
