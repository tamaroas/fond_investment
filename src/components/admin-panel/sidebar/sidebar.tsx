"use client";
import React, { useState } from "react";
import SidebarItem from "./sidebarItem";

import { Icon } from "../../ui/Icon";
import { Bell, ChevronRight } from "lucide-react";
import { navigationItems } from "@/lib/constants/navigationConfig";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      onMouseEnter={toggleCollapse}
      onMouseLeave={toggleCollapse}
      className={cn(
        "hidden md:flex flex-col bg-slate-500 shadow-lg h-full transition-all duration-300 hover:w-64 ease-in-out relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className="p-4 flex items-center cursor-pointer"
        onClick={toggleCollapse}
      >
        <Image src="/assets/images/logo.png" alt="logo" width={40} height={40} className="w-10 h-10 flex-shrink-0" />
        {!collapsed && (
          <>
            <h1 className=" mx-2 text-lg font-semibold text-white">Dashboard</h1>

            <div className=" bg-card-foreground absolute top-5 -right-6 z-50 rounded-r-md shadow-md">
              <ChevronRight className="ml-auto text-gray-400 h-6 w-6" />
            </div>
          </>
        )}
        {collapsed && (
          <ChevronRight className="ml-auto text-white h-6 w-6 absolute top-5 -right-0" />
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navigationItems.map((item, index) => {
            return (
              <SidebarItem
                key={index}
                href={item.href}
                icon={<Icon icon={item.iconComponent} className="" />}
                label={collapsed ? "" : item.translationKey}
                collapsed={collapsed}
              />
            );
          })}
        </ul>
      </nav>
      <div className="px-4 py-3 flex flex-col gap-2">
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
        <div className={cn("flex", collapsed ? "justify-center" : "")}>
          <div className="bg-[#135C99] h-12 w-12 rounded-lg flex items-center justify-center">
            <h1 className="text-xl font-semibold text-white uppercase">AD</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
