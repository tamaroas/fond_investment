import {
    LucideIcon,
    Home,
    TextQuote ,
    Expand,
    Code,
    AtSign 
  } from "lucide-react";
  import { Langs } from "@/utils/langs-config";
  
  type Submenu = {
    href: string;
    label: string;
    active: boolean;
  };
  
  type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
    submenus: Submenu[];
  };
  
  type Group = {
    groupLabel: string;
    menus: Menu[];
  };
  
  export function getMenuList(pathname: string, lang: Langs | string, dictionary: { [key: string]: string }): Group[] {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: `/${lang}`,
            label: dictionary?.home,
            active: pathname.includes("/"),
            icon: Home,
            submenus: []
          },
          {
            href: `/${lang}/about`,
            label: dictionary?.about,
            active: false,
            icon: TextQuote ,
            submenus: []
          },
          {
            href: `/${lang}/features`,
            label: dictionary?.features,
            active: false,
            icon: Expand,
            submenus: []
          },
          {
            href: `/${lang}/resources`,
            label: dictionary?.resources,
            active: false,
            icon: Code,
            submenus: []
          },
          {
            href: `/${lang}/contact`,
            label: dictionary?.contact,
            active: false,
            icon: AtSign ,
            submenus: []
          }
        ]
      }
    ];
  }
  