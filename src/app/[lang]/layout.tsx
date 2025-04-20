import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "../globals.css";
import '@/utils/type/globalType'

import { ThemeProvider } from "@/providers/theme-provider";
import { Langs } from "@/utils/langs-config";
import { getDictionary } from "@/utils/getDictionary";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Viazipay",
  description:
    "",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "", 

  },
  openGraph: {
    url: "/",
    title: "Viazipay",
    description:
      "",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Viazipay",
    description:
      "A stunning and functional retractable sidebar for Next.js built on top of shadcn/ui complete with desktop and mobile responsiveness."
  }
};

export default async function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode, params: { lang: Langs }
}>) {

  const dictionary = await getDictionary(params.lang) 
  return (
    <html lang={params.lang} >
      {/* <html lang={params.lang} suppressHydrationWarning> */}
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
