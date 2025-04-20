'use client'

import Link from "next/link";
import getNavItems from "../header/front-menu-list";
import Image from "next/image"; 
import { useParams } from "next/navigation";
import LogoLink from "@/components/ui/logo-link";

export function Footer({ dictionary }: any) {
    const linkItems = getNavItems(dictionary);

    const { lang } = useParams()

    return (
        <footer className="container py-6 md:py-0 border-t f border-border/40">
            <div className="mt-1 p-7 ">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground italic">©2025 TamaroasDev Tech</p>
            </div>
        </footer>
    )
}