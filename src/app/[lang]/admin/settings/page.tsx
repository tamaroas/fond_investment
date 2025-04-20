import Link from "next/link";

import PlaceholderContent from "@/components/admin-panel/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/layout/content-layout";
import {
  Breadcrumb,
  BreadcrumbCustom,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Langs } from "@/utils/langs-config";
import { getDictionary } from "@/utils/getDictionary";
import { userCookies } from "@/utils/cookies";
import { userBootstrap } from "@/utils/services/userServices";
import { notFound } from "next/navigation";
import PaimentSettings from "@/components/admin-panel/settings/paiment-settings";
import OtherSettings from "@/components/admin-panel/settings/other-settings";

export default async function SettingsPage({ params }: { params: { lang: Langs } }) {

  const dictionary = await getDictionary(params.lang)

  const options_bread = [
    {
      label: dictionary.dashboard,
      path: `/${params.lang}/admin`
    },
    {
      path: undefined,
      label: dictionary.settings
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
    <ContentLayout title={dictionary.settings} dictionary={dictionary}>
      <BreadcrumbCustom options={options_bread} />
      <PlaceholderContent >
        <PaimentSettings dictionary={dictionary} bootstrapDatas={bootstrapDatas?.datas} />
        <OtherSettings dictionary={dictionary} bootstrapDatas={bootstrapDatas?.datas} />
      </PlaceholderContent >
    </ContentLayout>
  );
}
