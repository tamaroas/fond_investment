"use client";
import Link from "next/link";
import Image from "next/image";
import { PanelsTopLeft, Users, Wallet, CreditCard, LineChart, FileText, Settings, Banknote, Calculator } from "lucide-react";
import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";


import { Langs } from "@/utils/langs-config";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { useUserStore } from "@/store/zustandStores";

const menuItems = [
  {
    title: "Gestion des Comptes",
    description: "Gestion des comptes clients et opérations bancaires",
    icon: <Users className="w-8 h-8" />,
    href: "/admin/users"
  },
  {
    title: "Crédits",
    description: "Gestion des prêts et des échéances",
    icon: <CreditCard className="w-8 h-8" />,
    href: "/credits"
  },
  {
    title: "Épargne",
    description: "Gestion des comptes d'épargne et des intérêts",
    icon: <Wallet className="w-8 h-8" />,
    href: "/epargne"
  },
  {
    title: "Trésorerie",
    description: "Suivi des flux de trésorerie et des caisses",
    icon: <Banknote className="w-8 h-8" />,
    href: "/tresorerie"
  },
  {
    title: "Rapports",
    description: "Rapports financiers et statistiques",
    icon: <LineChart className="w-8 h-8" />,
    href: "/rapports"
  },
  {
    title: "Documents",
    description: "Gestion des documents et contrats",
    icon: <FileText className="w-8 h-8" />,
    href: "/documents"
  },
  {
    title: "Calculatrice",
    description: "Calcul des intérêts et des échéances",
    icon: <Calculator className="w-8 h-8" />,
    href: "/calculatrice"
  },
  {
    title: "Paramètres",
    description: "Configuration du système",
    icon: <Settings className="w-8 h-8" />,
    href: "/parametres"
  }
];

export default async function HomePage({
  params
}: Readonly<{
  params: { lang: Langs }
}>) {
  // const dictionary = await getDictionary(params.lang);
  const user = useUserStore((state:any) => state.user);
  // if(!user){
  //   return redirect('/login');
  // }

  return (
    <div className="container mx-auto p-4 mt-8 flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-card">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  {item.icon}
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
