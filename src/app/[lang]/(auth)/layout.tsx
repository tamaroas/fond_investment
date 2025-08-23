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
    <div className=" h-screen flex flex-col justify-center">
   
 
          {children}
       
      {/* <Footer dictionary={dictionary} /> */}
    </div>
  );
}
