
import { ContentLayout } from "@/components/admin-panel/layout/content-layout";
import { ContentAddUsersWithContract } from "@/components/admin-panel/users/ContentAddUsersWithContract";
import { BreadcrumbCustom } from "@/components/ui/breadcrumb";
import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";
import { getAllUserService } from "@/utils/services/userServices";


export default async function UsersPage({ params }: { params: { lang: Langs } }) {
  const dictionary = await getDictionary(params.lang);
  const resp = await getAllUserService()
  let users = [] as User[];
  if (resp?.status) {
    users = resp?.content
  }

  const options_bread = [
    {
      label: dictionary.dashboard,
      path: `/${params.lang}/admin`
    },
    {
      path: `/${params.lang}/admin/users`,
      label: dictionary.users,
    },
    {
      path: undefined,
      label: dictionary.users
    },
  ];


  return (
    <ContentLayout title={dictionary.users} dictionary={dictionary}>
      <BreadcrumbCustom options={options_bread} />
      <ContentAddUsersWithContract />

    </ContentLayout>
  );
}
