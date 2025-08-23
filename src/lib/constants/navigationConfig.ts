import React from "react";

import { PanelsTopLeft, User, House, Users, Wallet, CreditCard, LineChart, FileText, Settings, Banknote, Calculator } from "lucide-react";


// This type defines the structure of a navigation item
export interface NavItem {
  href: string;
  iconComponent: React.ComponentType;
  translationKey: string;
  disabled?: boolean;
}


export const navigationItems: NavItem[] = [
  {
    href: "/admin",
    iconComponent: House,
    translationKey: "Accueil",
  },

  {
    translationKey: "Utilisateurs",
    iconComponent: Users,
    href: "/admin/users"
  },
  {
    translationKey: "Agences ",
    iconComponent: CreditCard,
    href: "/admin/agencies"
  },



  {
    translationKey: "Plans",
    iconComponent: FileText,
    disabled: false,
    href: "/admin/type-contrat"
  },
  {
    translationKey: "Paramètres",
    iconComponent: Settings,
    disabled: false,
    href: "/admin/settings"
  }
];
