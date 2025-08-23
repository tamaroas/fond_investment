import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  ChevronsDown,
  UserCog,
  ArrowRightLeft,
  Wallet,
  LayoutGrid,
  LucideIcon
} from "lucide-react";
import { Langs } from "./langs-config";
import { ViaziCustomer } from "./type/otherType";


type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getSidebarMenuList(pathname: string, lang: Langs | string, dictionary: { [key: string]: string }, user: ViaziCustomer | null): Group[] {

  const menu: Group[] = [
    {
      groupLabel: "",
      menus: []
    },
    {
      groupLabel: "Contents",
      menus: []
    },
    {
      groupLabel: "Settings",
      menus: []
    }
  ];

  if (!user) {
    return menu
  }


  /** 
   * by Franky Alongamo : Viaziza
   * if user is only administrator
   */
  if (isAdmin(user)) {
    menu.forEach((group) => {
      switch (group.groupLabel) {
        case 'Contents':
          group.menus.push(
            {
              href: `/${lang}/admin/withdrawal-method`,
              label: dictionary.withdrawal_method,
              active: pathname.includes("/withdrawal-method"),
              icon: ChevronsDown,
              submenus: []
            }
          )
          break;
        case 'Settings':
          group.menus.push(
            {
              href: `/${lang}/admin/users`,
              label: dictionary.users,
              active: pathname.includes("/users"),
              icon: Users,
              submenus: []
            }
          )
          group.menus.push(
            {
              href: `/${lang}/admin/settings`,
              label: dictionary.settings,
              active: pathname.includes("/settings"),
              icon: Settings,
              submenus: []
            }
          )

          break;
        default:

          break;
      }
    })

  }

  /** 
   * by Franky Alongamo : Viaziza
   * if user is only customer
   */
  if (isCustomer(user)) {
    menu.forEach((group) => {
      switch (group.groupLabel) {
        case 'Contents':

          break;
        case 'Settings':

          break;
        default:

          break;
      }
    })

  }

  /** 
   * by Franky Alongamo : Viaziza
   * if user is administrator or  customer
   */
  if (isCustomer(user) || isAdmin(user)) {
    menu.forEach((group) => {
      switch (group.groupLabel) {
        case 'Contents':
          group.menus.push(
            {
              href: `/${lang}/admin/transactions`,
              label: dictionary.transactions,
              active: pathname.includes("/transactions"),
              icon: ArrowRightLeft,
              submenus: []
            }
          )
          group.menus.push(
            {
              href: `/${lang}/admin/wallet`,
              label: dictionary.wallet,
              active: pathname.includes("/wallet"),
              icon: Wallet,
              submenus: []
            }
          )

          break;
        case 'Settings':
          group.menus.push(
            {
              href: `/${lang}/admin/profile`,
              label: 'profile',
              active: pathname.includes("/profile"),
              icon: UserCog,
              submenus: []
            }
          )


          break;
        default:
          group.menus.push(
            {
              href: `/${lang}/admin`,
              label: dictionary.dashboard,
              active: pathname.includes("/dashboard"),
              icon: LayoutGrid,
              submenus: []
            })
          break;
      }
    })

  }

  /** 
   * Chef d'agence avec accès aux fonctionnalités gestionnaire + gestion d'équipe
   */
  if (isChefAgence(user)) {
    menu.forEach((group) => {
      switch (group.groupLabel) {
        case 'Contents':
          // Accès aux fonctionnalités gestionnaire
          group.menus.push(
            {
              href: `/${lang}/admin/transactions`,
              label: dictionary.transactions || "Transactions",
              active: pathname.includes("/transactions"),
              icon: ArrowRightLeft,
              submenus: []
            }
          )
          group.menus.push(
            {
              href: `/${lang}/admin/wallet`,
              label: dictionary.wallet || "Portefeuille",
              active: pathname.includes("/wallet"),
              icon: Wallet,
              submenus: []
            }
          )
          break;
        case 'Settings':
          // Gestion des utilisateurs de l'agence
          group.menus.push(
            {
              href: `/${lang}/admin/users`,
              label: "Gestion Équipe",
              active: pathname.includes("/users"),
              icon: Users,
              submenus: []
            }
          )
          group.menus.push(
            {
              href: `/${lang}/admin/profile`,
              label: 'Profil',
              active: pathname.includes("/profile"),
              icon: UserCog,
              submenus: []
            }
          )
          break;
        default:
          group.menus.push(
            {
              href: `/${lang}/admin`,
              label: "Dashboard Chef",
              active: pathname === `/${lang}/admin` || pathname.includes("/dashboard"),
              icon: LayoutGrid,
              submenus: []
            })
          break;
      }
    })
  }

  /** 
   * Gestionnaire - accès aux clients et fonctionnalités de base
   */
  if (isGestionnaire(user)) {
    menu.forEach((group) => {
      switch (group.groupLabel) {
        case 'Contents':
          group.menus.push(
            {
              href: `/${lang}/admin/transactions`,
              label: dictionary.transactions || "Transactions",
              active: pathname.includes("/transactions"),
              icon: ArrowRightLeft,
              submenus: []
            }
          )
          group.menus.push(
            {
              href: `/${lang}/admin/users`,
              label: "Clients",
              active: pathname.includes("/users"),
              icon: Users,
              submenus: []
            }
          )
          break;
        case 'Settings':
          group.menus.push(
            {
              href: `/${lang}/admin/profile`,
              label: 'Profil',
              active: pathname.includes("/profile"),
              icon: UserCog,
              submenus: []
            }
          )
          break;
        default:
          group.menus.push(
            {
              href: `/${lang}/admin`,
              label: "Dashboard",
              active: pathname === `/${lang}/admin` || pathname.includes("/dashboard"),
              icon: LayoutGrid,
              submenus: []
            })
          break;
      }
    })
  }

  /** 
   * Caissier - accès limité aux transactions
   */
  if (isCaissier(user)) {
    menu.forEach((group) => {
      switch (group.groupLabel) {
        case 'Contents':
          group.menus.push(
            {
              href: `/${lang}/admin/transactions`,
              label: dictionary.transactions || "Transactions",
              active: pathname.includes("/transactions"),
              icon: ArrowRightLeft,
              submenus: []
            }
          )
          break;
        case 'Settings':
          group.menus.push(
            {
              href: `/${lang}/admin/profile`,
              label: 'Profil',
              active: pathname.includes("/profile"),
              icon: UserCog,
              submenus: []
            }
          )
          break;
        default:
          group.menus.push(
            {
              href: `/${lang}/admin`,
              label: "Dashboard",
              active: pathname === `/${lang}/admin` || pathname.includes("/dashboard"),
              icon: LayoutGrid,
              submenus: []
            })
          break;
      }
    })
  }

  return menu;

}

const isAdmin = (user: ViaziCustomer) => {
  return user?.administrator ?? false
}

const isCustomer = (user: ViaziCustomer) => {
  return user?.customer ?? false
}

const isChefAgence = (user: any) => {
  return user?.role === "CHEF_AGENCE"
}

const isGestionnaire = (user: any) => {
  return user?.role === "GESTIONNAIRE"
}

const isCaissier = (user: any) => {
  return user?.role === "CAISSIER"
}
