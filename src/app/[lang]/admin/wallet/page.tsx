

import Link from "next/link";

import PlaceholderContent from "@/components/admin-panel/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/layout/content-layout";
import {
  BreadcrumbCustom,
} from "@/components/ui/breadcrumb";
import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";
import { userBootstrap } from "@/utils/services/userServices";
import { notFound } from "next/navigation";
import { userCookies } from "@/utils/cookies";
import { Content } from "@/components/admin-panel/wallet/Content";
import StartWihdrawal from "@/components/admin-panel/wallet/StartWihdrawal";

export default async function UsersPage({ params }: { params: { lang: Langs } }) {


  const dictionary = await getDictionary(params.lang)

  const options_bread = [
    {
      label: dictionary.dashboard,
      path: `/${params.lang}/admin`
    },
    {
      path: undefined,
      label: dictionary.wallet
    },
  ]

  const params_url = new URLSearchParams({
    access_token: userCookies.access_token ?? ''
  }).toString()

  const bootstrapDatas = await userBootstrap(undefined, params_url)
  if (!bootstrapDatas?.success) {
    return notFound()
  }

  return (
    <ContentLayout title={dictionary.wallet} dictionary={dictionary}>
      <BreadcrumbCustom options={options_bread} />
      <PlaceholderContent >
      <div className="flex justify-end items-end mb-5">
          <StartWihdrawal dictionary={dictionary} BootstrapUserInfo={bootstrapDatas?.datas} />
      </div>  
      <Content dictionary={dictionary} BootstrapUserInfo={bootstrapDatas?.datas} />
      </PlaceholderContent >
    </ContentLayout>
  );
}
