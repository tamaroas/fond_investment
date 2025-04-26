"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/admin-panel/footer";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";;
import { useParams } from "next/navigation";
import { Header } from "@/components/front-panel/header";
import Sidebar from "../sidebar/sidebar";

export default function AdminPanelLayout({
  children,
  dictionary
}: {
  children: React.ReactNode;
  dictionary: any;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const params = useParams();
  const lang = params.lang as string;

  if (!sidebar) return null;

  return (
    <main className="flex h-screen w-full">
      <Sidebar />
      <div
        className={cn(
          "bg-zinc-50 dark:bg-zinc-900  ease-in-out duration-300 flex-grow flex h-full flex-col overflow-y-scroll"
        )}
      >
        {/* <Header dictionary={dictionary} /> */}
        {children}
        <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300 w-full ")}
      >
        <Footer />
      </footer>
      </div>
     
    </main>
  );
}
