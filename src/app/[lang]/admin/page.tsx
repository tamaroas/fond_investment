
import PlaceholderContent from "@/components/admin-panel/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/layout/content-layout";
import {
  BreadcrumbCustom,
} from "@/components/ui/breadcrumb";
import { Langs } from "@/utils/langs-config";
import { getDictionary } from "@/utils/getDictionary";
import ClientBootstrap from "@/components/admin-panel/ClientBootstrap";
import { userBootstrap } from "@/utils/services/userServices";
import { userCookies } from "@/utils/cookies";
import Dashboard from "@/components/admin-panel/dashboard";
import { notFound } from "next/navigation";


export default async function DashboardPage({ params }: { params: { lang: Langs } }) {

  const dictionary = await getDictionary(params.lang)
  const options_bread = [
    {
      label: dictionary.dashboard,
      path: undefined
    }
  ]

  const params_url = new URLSearchParams({
    access_token: userCookies.access_token ?? ''
  }).toString()

  const bootstrapDatas = await userBootstrap(undefined, params_url)
  if (!bootstrapDatas?.success) {
    return notFound()
  }


  return (
    <ClientBootstrap>
      <ContentLayout dictionary={dictionary} title={dictionary.dashboard}>
        <BreadcrumbCustom options={options_bread} />
        <PlaceholderContent >
          <Dashboard dictionary={dictionary} BootstrapUserInfo={bootstrapDatas?.datas} />
        </PlaceholderContent >
      </ContentLayout>
    </ClientBootstrap>
  );
}
