'use client'

import { PanelsTopLeft } from "lucide-react";
import { Button } from "../../ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "../../mode-toggle";
import Link from "next/link";
import getNavItems from "@/components/front-panel/header/front-menu-list";
import { LanguageSelector } from "./LanguageSelector";
import { SheetMenu } from "./sheet-menu";
import { UserNav } from "@/components/user-nav"; 
import { useParams } from "next/navigation";
import LogoLink from "@/components/ui/logo-link";


export function Header({ dictionary }: any) {

    const navItems = getNavItems(dictionary)
    const { lang } = useParams()

    return (
        <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
            <div className="container h-14 flex items-center justify-between">
                {/* Bloc Start */}
                <div className="mx-4 sm:mx-8 flex h-14 items-center">
                    <div className="flex items-center space-x-4 lg:space-x-0">
                        <SheetMenu dictionary={dictionary} />
                        <div className="flex items-center space-x-3">
                            <LogoLink href={`/${lang}`} />
                        </div>
                    </div>
                </div>

                {/* Bloc Center */}
                <nav className="hidden lg:block flex items-center justify-center flex-grow">
                    <ul className="flex items-center gap-10">
                        {navItems.map((item, index) => (
                            <li key={index + "NAVBAR"}>
                                <Link href={item.href}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Bloc End */}
                <div className="flex items-center space-x-2">
                    <LanguageSelector />
                    {/* <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-8 h-8 bg-background"
                    asChild
                    >
                    <Link href="https://github.com/salimi-my/shadcn-ui-sidebar">
                        <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
                    </Link>
                    </Button> */}
                    <UserNav />
                    <ModeToggle />
                </div>
            </div>

        </header>
    )
}