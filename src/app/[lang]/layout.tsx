import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "../globals.css";
import "@/utils/type/globalType";

import { ThemeProvider } from "@/providers/theme-provider";
import { Langs } from "@/utils/langs-config";
import { getDictionary } from "@/utils/getDictionary";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Latrust",
  description: "",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: ""
  },
  openGraph: {
    url: "/",
    title: "Latrust",
    description: "",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Latrust",
    description: "Fond d'investissement"
  }
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Langs };
}>) {
  const dictionary = await getDictionary(params.lang);
  return (
    <html lang={params.lang}>
      <body className={GeistSans.className}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
