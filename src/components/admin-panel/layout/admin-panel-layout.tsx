"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/admin-panel/footer";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Sidebar } from "../sidebar/sidebar";
import { Langs } from "@/utils/langs-config";
import { useParams } from "next/navigation";

export default function AdminPanelLayout({
  children, dictionary
}: {
  children: React.ReactNode, dictionary: any
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const params = useParams()
  const lang = params.lang as string

  if (!sidebar) return null;

  return (
    <>
      <Sidebar lang={lang} dictionary={dictionary} />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
