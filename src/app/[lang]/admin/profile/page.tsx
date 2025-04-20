import Link from "next/link";

import PlaceholderContent from "@/components/admin-panel/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/layout/content-layout";
import {
  BreadcrumbCustom,
} from "@/components/ui/breadcrumb";
import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";
import Profile from "@/components/profile";
import { userCookies } from "@/utils/cookies";
import { userBootstrap } from "@/utils/services/userServices";
import { notFound } from "next/navigation";

export default async function UsersPage({ params }: { params: { lang: Langs } }) {


  const dictionary = await getDictionary(params.lang)

  const options_bread = [
    {
      label: dictionary.dashboard,
      path: `/${params.lang}/admin`
    },
    {
      path: undefined,
      label: 'profile'
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
    <ContentLayout title={'profile'} dictionary={dictionary}>
      <BreadcrumbCustom options={options_bread} />
      <PlaceholderContent >
        <Profile dictionary={dictionary} bootstrapDatas={bootstrapDatas?.datas} />
      </PlaceholderContent >
    </ContentLayout>
  );
}
