"use client";
import React, { useState } from "react";
import SidebarItem from "./sidebarItem";

import { Icon } from "../../ui/Icon";
import { Bell, ChevronRight, LogOut, Crown, ArrowLeft, Users } from "lucide-react";
import { navigationItems } from "@/lib/constants/navigationConfig";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useUserStore } from "@/store/zustandStores";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const { lang } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Define role-specific navigation items
  const gestionnaire = navigationItems.filter(item =>
    ["Accueil", "Gestion des Clients", "Trésorerie"].includes(item.translationKey)
  );

  const caissiere = navigationItems.filter(item =>
    ["Accueil", "Transactions"].includes(item.translationKey)
  );
  const chefAgence = navigationItems.filter(item =>
    ["Accueil", "Gestion des Clients", "Trésorerie", "Transactions"].includes(item.translationKey)
  );
  const admin = navigationItems; // Admin has access to allww navigation items

  // Select navigation items based on user role
  const navItems = user?.role === "GESTIONNAIRE"
    ? gestionnaire
    : user?.role === "CAISSIER"
      ? caissiere
      : user?.role === "ADMIN"
        ? admin
        : user?.role === "CHEF_AGENCE"
          ? chefAgence
          : navigationItems; // Default to all items if role is not specified

  // Logout function
  const handleLogout = () => {
    setIsLoading(true);
    // Process logout
    setTimeout(() => {
      setUser(null);
      toast({
        description: 'Déconnexion réussie'
      });
      router.push(`/${lang}/login`);
      setIsLoading(false);
    }, 500);
  };

  // Chef d'agence return function
  const handleReturnToChefDashboard = () => {
    if (user?.originalRole === "CHEF_AGENCE") {
      const chefUser = {
        ...user,
        role: user.originalRole
      };
      delete chefUser.originalRole;
      
      setUser(chefUser);
      
      toast({
        title: "Mode Chef d'Agence",
        description: "Retour au dashboard chef d'agence",
      });
      
      router.push(`/${lang}/admin`);
    }
  };

  // Admin return function
  const handleReturnToAdminDashboard = () => {
    if (user?.originalAdministrator !== undefined && user?.originalRole) {
      const adminUser = {
        ...user,
        administrator: user.originalAdministrator,
        role: user.originalRole
      };
      delete adminUser.originalAdministrator;
      delete adminUser.originalRole;
      
      setUser(adminUser);
      
      toast({
        title: "Mode Admin",
        description: "Retour au dashboard administrateur",
      });
      
      router.push(`/${lang}/admin`);
    }
  };

  return (
    <div
      onMouseEnter={toggleCollapse}
      onMouseLeave={toggleCollapse}
      className={cn(
        "hidden md:flex flex-col bg-[#135C99] shadow-lg h-full transition-all duration-300 hover:w-64 ease-in-out relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className="p-4 flex items-center cursor-pointer"
        onClick={toggleCollapse}
      >
        <div className={cn("flex", collapsed ? "justify-center" : "")}>
          <div className="bg-slate-500 h-12 w-12 rounded-lg flex justify-center items-center">
            <h1 className="text-xl font-semibold text-white uppercase">{user && user?.prenom[0]?.toUpperCase() + user?.nom[0].toUpperCase()}</h1>

          </div>
        </div>
        {!collapsed && (
          <div className="flex flex-col ">
            <h1 className=" mx-2 text-md font-semibold text-white capitalize">{user && user?.prenom}</h1>
            <h1 className=" mx-2 text-sm font-semibold text-white capitalize">{user && user?.nom}</h1>
            <h1 className=" mx-2 text-xs font-light text-white capitalize">{user && user?.id}</h1>
            <div className=" bg-card-foreground absolute top-5 -right-6 z-50 rounded-r-md shadow-md">
              <ChevronRight className="ml-auto text-gray-400 h-6 w-6" />
            </div>
          </div>
        )}
        {collapsed && (
          <ChevronRight className="ml-auto text-white h-6 w-6 absolute top-5 -right-0" />
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            return (
              <SidebarItem
                key={index}
                href={item.href}
                icon={<Icon icon={item.iconComponent} className="" />}
                label={collapsed ? "" : item.translationKey}
                collapsed={collapsed}
                disabled={item.disabled}
              />
            );
          })}
        </ul>
      </nav>
      <div className="px-4 py-3 flex flex-col gap-2">
        {/* Chef d'agence return button - only show when in manager mode */}
        {user?.originalRole === "CHEF_AGENCE" && (
          <>
            {!collapsed && (
              <div 
                className="flex gap-2 text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300 cursor-pointer px-3 py-2 rounded-md"
                onClick={handleReturnToChefDashboard}
              >
                <Crown className="w-6 h-6 mr-3" />
                <h1>Dashboard Chef</h1>
              </div>
            )}
            {collapsed && (
              <div 
                className="flex justify-center text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300 cursor-pointer p-2 rounded-md"
                onClick={handleReturnToChefDashboard}
              >
                <Crown className="w-6 h-6" />
              </div>
            )}
          </>
        )}

        {/* Admin return button - only show when in role switching mode */}
        {user?.originalAdministrator !== undefined && (
          <>
            {!collapsed && (
              <div 
                className="flex gap-2 text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 cursor-pointer px-3 py-2 rounded-md"
                onClick={handleReturnToAdminDashboard}
              >
                <Users className="w-6 h-6 mr-3" />
                <h1>Dashboard Admin</h1>
              </div>
            )}
            {collapsed && (
              <div 
                className="flex justify-center text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 cursor-pointer p-2 rounded-md"
                onClick={handleReturnToAdminDashboard}
              >
                <Users className="w-6 h-6" />
              </div>
            )}
          </>
        )}

        {!collapsed && (
          <div className="flex gap-2 text-white transition-all duration-300 hover:bg-white hover:text-accent-foreground cursor-pointer px-3 py-2 rounded-md">
            <Bell className="w-6 h-6 mr-3" />
            <h1>Notifications</h1>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center text-white transition-all duration-300 hover:bg-white hover:text-accent-foreground cursor-pointer p-2 rounded-md">
            <Bell className="w-6 h-6" />
          </div>
        )}

        {/* Logout Button */}
        {!collapsed && (
          <div
            className="flex gap-2 text-white transition-all duration-300 hover:bg-white hover:text-accent-foreground cursor-pointer px-3 py-2 rounded-md"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6 mr-3" />
            <h1>{isLoading ? "Déconnexion..." : "Déconnexion"}</h1>
          </div>
        )}
        {collapsed && (
          <div
            className="flex justify-center text-white transition-all duration-300 hover:bg-white hover:text-accent-foreground cursor-pointer p-2 rounded-md"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6" />
          </div>
        )}



      </div>
    </div>
  );
}
