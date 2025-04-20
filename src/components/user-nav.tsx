"use client";

import Link from "next/link";
import { LayoutGrid, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/zustandStores";
import { FaceIcon } from "@radix-ui/react-icons";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { userServiceLogout } from "@/utils/services/userServices";
import { toast } from "./ui/use-toast";
import { LoadingSpinner } from "./ui/loadingSpinner";

export function UserNav() {
  const [isLoader, setIsLoader] = useState(false)
  const { user, setUser } = useUserStore()
  const { lang } = useParams()
  const pathname = usePathname()
  const route = useRouter()
  const administrator = user?.administrator
  const customer = user?.customer
  const firstname = administrator?.firstname ?? customer?.firstname
  const lastname = administrator?.lastname ?? customer?.lastname
  const email = administrator?.email ?? customer?.email
  const avatar = (firstname ? firstname[0].toUpperCase() : '') + (lastname ? lastname[0].toUpperCase() : '')

  const processLogout: CallBackResponseUseFetch = (resp) => {
    setIsLoader(false)
    if (resp?.success) {
      toast({ description: 'Deconnexion reussit' })
      if (pathname.includes('/admin')) {
        route.push('/login')
      }
      return setUser(null)
    }
    return toast({ variant: "destructive", description: 'Echec de la Deconnexion!' })
  }

  const signOut = () => {
    setIsLoader(true)
    userServiceLogout(processLogout)
  }


  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="#" alt="Avatar" />
                  <AvatarFallback className={`${!user ? 'bg-transparent' : 'bg-transparent'}`} >
                    {
                      isLoader ? <LoadingSpinner className=" ml-[7px]" />
                        : user ? avatar
                          : <User className="w-4 h-4 text-muted-foreground" />
                    }
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {
          user ? <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{firstname + ' ' + lastname}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel> : null
        }
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {
            user ?
              <>
                <DropdownMenuItem className="hover:cursor-pointer" asChild>
                  <Link href={`/${lang}/admin`} className="flex items-center">
                    <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              </>
              :
              <>
                <DropdownMenuItem className="hover:cursor-pointer" asChild>
                  <Link href={`/${lang}/login`} className="flex items-center">
                    <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
                    login
                  </Link>
                </DropdownMenuItem>
              </>
          }

        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {
          user ?
            <DropdownMenuItem className="hover:cursor-pointer" onClick={() => { signOut() }}>
              <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
              Sign out
            </DropdownMenuItem>
            : null
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
