import AdminPanelLayout from "@/components/admin-panel/layout/admin-panel-layout";
import { userCookies } from "@/utils/cookies";
import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";
import { redirect } from "next/navigation";

export default async function DemoLayout({
  children, params
}: {
  children: React.ReactNode, params: { lang: Langs }
}) {

  const access_token = userCookies?.access_token
  if (!access_token) {
    redirect(`/${params.lang}/login`);
  }
  

  const dictionary = await getDictionary(params.lang)

  return <AdminPanelLayout dictionary={dictionary}>{children}</AdminPanelLayout>;
}
