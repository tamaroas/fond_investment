"use client"
import AdminPanelLayout from "@/components/admin-panel/layout/admin-panel-layout";
import { useUserStore } from "@/store/zustandStores";
import { userCookies } from "@/utils/cookies";
import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";
import { redirect } from "next/navigation";

export default async function DemoLayout({
  children, params,
  gestionnaire,
  caissiere,
  admin,
  chefAgence
}: {
  children: React.ReactNode,
  params: { lang: Langs }
  gestionnaire: React.ReactNode,
  caissiere: React.ReactNode,
  admin: React.ReactNode,
  chefAgence: React.ReactNode
}) {
  const { user } = useUserStore();

  const child = user?.role === "GESTIONNAIRE" ? gestionnaire : user?.role === "CAISSIER" ? caissiere : (user?.administrator || user?.role === "ADMIN" || user?.role === "ADMINISTRATEUR") ? admin : user?.role === "CHEF_AGENCE" ? chefAgence : null;

  const dictionary = await getDictionary(params.lang)

  return <AdminPanelLayout dictionary={dictionary}>{child}</AdminPanelLayout>;
}
