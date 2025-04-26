import { Footer } from "@/components/front-panel/footer";
import { Header } from "@/components/front-panel/header";
import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";



export default async function Layout({
  children, params
}: Readonly<{
  children: React.ReactNode, params: { lang: Langs }
}>) {

  const dictionary = await getDictionary(params.lang);

  return (
    <div className="flex flex-col min-h-screen">
   
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="container relative pb-10">
          {children}
        </div>
      </main>
      <Footer dictionary={dictionary} />
    </div>
  );
}
