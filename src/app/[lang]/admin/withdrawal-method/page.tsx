import Link from "next/link";

import PlaceholderContent from "@/components/admin-panel/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/layout/content-layout";
import {
  BreadcrumbCustom,
} from "@/components/ui/breadcrumb";
import { Langs } from "@/utils/langs-config";
import { getDictionary } from "@/utils/getDictionary";
import Content from "@/components/admin-panel/withdrawal-method/Content";
import { userCookies } from "@/utils/cookies";
import { userBootstrap } from "@/utils/services/userServices";
import { notFound } from "next/navigation";

export default async function TransactionsPage({ params }: { params: { lang: Langs } }) {

  const dictionary = await getDictionary(params.lang)

  const options_bread = [
    {
      label: dictionary.dashboard,
      path: `/${params.lang}/admin`
    },
    {
      path: undefined,
      label: dictionary.withdrawal_method
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
    <ContentLayout title="withdrawal method" dictionary={dictionary}>
      <BreadcrumbCustom options={options_bread} />
      <Content dictionary={dictionary} BootstrapUserInfo={bootstrapDatas?.datas} />
    </ContentLayout>
  );
}
