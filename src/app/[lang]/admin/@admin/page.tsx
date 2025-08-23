"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, FileText, TrendingDown, Calculator } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";
import { useEffect, useState } from "react";
import { BreadcrumbCustom } from "@/components/ui/breadcrumb";

function AdminPage({ params }: { params: { lang: Langs } }) {
  const [dictionary, setDictionary] = useState<any>({});
  const [options_bread, setOptionsBread] = useState<any[]>([]);

  // Charger le dictionnaire pour les traductions
  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(params.lang);
      setDictionary(dict);

      setOptionsBread([
        {
          path: undefined,
          label: dict.dashboard || "Accueil"
        }
      ]);
    };

    loadDictionary();
  }, [params.lang]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{"Accueil "}</h1>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte Gestion des Agences */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {"Gestion des Utilisateurs"}
            </CardTitle>
            <CardDescription>
              {dictionary.usersDescription || "Gérer les utilisateurs du système"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {dictionary.usersContent || "Créez et gérez les gestionnaires, chefs d'agence et caissiers."}
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/${params.lang}/admin/users`} className="w-full">
              <Button variant="default" className="w-full">
                {dictionary.manage || "Gérer"}
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {dictionary.agencies || "Gestion des Agences"}
            </CardTitle>
            <CardDescription>
              {dictionary.agenciesDescription || "Créer, modifier et gérer les agences"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {dictionary.agenciesContent || "Gérez toutes vos agences, leurs informations et leurs statuts."}
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/${params.lang}/admin/agencies`} className="w-full">
              <Button variant="default" className="w-full">
                {dictionary.manage || "Gérer"}
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Carte Gestion des Utilisateurs */}

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {"Gestion des Plans "}
            </CardTitle>
            <CardDescription>
              {"Gérer les plans"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {dictionary.usersContent || "Créez et gérez les gestionnaires, chefs d'agence et caissiers."}
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/${params.lang}/admin/type-contrat`} className="w-full">
              <Button variant="default" className="w-full">
                {dictionary.manage || "Gérer"}
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Carte Gestion des Retraits */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              {"Gestion des Retraits"}
            </CardTitle>
            <CardDescription>
              {"Gérer et approuver les demandes de retrait"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {"Visualisez et approuvez toutes les demandes de retrait des clients."}
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/${params.lang}/admin/retraits`} className="w-full">
              <Button variant="default" className="w-full">
                {"Gérer les Retraits"}
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Carte Calculatrice */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {"Calculatrice"}
            </CardTitle>
            <CardDescription>
              {"Outil de calcul financier"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {"Effectuez des calculs d'intérêts, d'épargne et autres calculs financiers."}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="default" className="w-full" disabled>
              {"Bientôt disponible"}
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  );
}

export default AdminPage;
