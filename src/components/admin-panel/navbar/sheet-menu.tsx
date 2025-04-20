'use client'

import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Props {
  dictionary: DictionaryType
}

import { SidebarMenuMobile } from "./sidebar-menu-mobile"; 
import { useParams } from "next/navigation";
import LogoLink from "@/components/ui/logo-link";

export function SheetMenu(props: Props) {
  const { dictionary } = props

  const { lang } = useParams()

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <LogoLink href={`/${lang}`} />
          </Button>
        </SheetHeader>
        <SidebarMenuMobile dictionary={dictionary} isOpen />
      </SheetContent>
    </Sheet>
  );
}
