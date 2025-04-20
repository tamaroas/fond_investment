import { Langs } from "@/utils/langs-config";
import Link from "next/link";
import Image from "next/image";
import { PanelsTopLeft } from "lucide-react";
import { ArrowRightIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import LoginForm from "@/components/LoginForm";
import { getDictionary } from "@/utils/getDictionary";

export default async function LoginPage({ params }: { params: { lang: Langs } }) {

    const dictionary = await getDictionary(params.lang) as any
    return (
        <div className=" flex items-center justify-center min-h-[70vh]">
            <LoginForm dictionary={dictionary} />
        </div>
    );
}
