"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/admin-panel/footer";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";;
import { useParams } from "next/navigation";
import { Header } from "@/components/front-panel/header";
import Sidebar from "../sidebar/sidebar";
import { ModeGestionnaireButton } from "@/components/chef-agence/mode-gestionnaire-button";
import { useUserStore } from "@/store/zustandStores";

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
  const { user } = useUserStore();

  if (!sidebar) return null;

  return (
    <main className="flex h-screen w-full">
      <Sidebar />
      <div
        className={cn(
          "bg-zinc-50 dark:bg-zinc-900 ease-in-out duration-300 flex-grow flex h-full flex-col"
        )}
      >
        {/* <Header dictionary={dictionary} /> */}
        {user?.role === "CHEF_AGENCE" && (
          <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-gray-800">Chef d'Agence</h2>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600">Accès complet aux fonctions gestionnaire</span>
            </div>
            <ModeGestionnaireButton />
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        <footer className="w-full bg-white border-t">
          <Footer />
        </footer>
      </div>
     
    </main>
  );
}
