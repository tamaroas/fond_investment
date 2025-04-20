import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { stat } from "fs";
import { use } from "react";



export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      {children}
    </>
  );
}
