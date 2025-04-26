import React from "react";

import { PanelsTopLeft,User,House ,Users, Wallet, CreditCard, LineChart, FileText, Settings, Banknote, Calculator } from "lucide-react";


// This type defines the structure of a navigation item
export interface NavItem {
  href: string;
  iconComponent: React.ComponentType;
  translationKey: string;
}


export const navigationItems:  NavItem[]  = [
  {
    href: "/dashboard",
    iconComponent: House ,
    translationKey: "Dashboard",
  },

  {
    translationKey: "Gestion des Comptes",
    iconComponent: Users,
    href: "/admin/users"
  },
  {
    translationKey: "Crédits",
    iconComponent: CreditCard,
    href: "/credits"
  },
  {
    translationKey: "Épargne",
    iconComponent: Wallet,
    href: "/epargne"
  },
  {
    translationKey: "Trésorerie",
    iconComponent: Banknote,
    href: "/tresorerie"
  },
  {
    translationKey: "Rapports",
    iconComponent: LineChart,
    href: "/rapports"
  },
  {
    translationKey: "Documents",
    iconComponent: FileText,
    href: "/documents"
  },
  {
    translationKey: "Calculatrice",
    iconComponent: Calculator,
    href: "/calculatrice"
  },
  {
    translationKey: "Paramètres",
    iconComponent: Settings,
    href: "/parametres"
  }
];
