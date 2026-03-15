"use client";

import { useSidebarStore } from "@/store/useSidebarStore";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BookOpen, History, LayoutDashboard, Settings, UserCircle, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: BookOpen, label: "Exam Setup", href: "/setup" },
  { icon: History, label: "History", href: "/history" },
  { icon: UserCircle, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function AppSidebar() {
  const { collapsed, toggle } = useSidebarStore();
  const pathname = usePathname();

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ type: "spring", damping: 25, stiffness: 180 }}
      className="h-screen flex-shrink-0 relative overflow-hidden hidden md:block border-r border-white/10 bg-black/40 backdrop-blur-xl"
    >
      <Sidebar collapsible="icon" className="w-full h-full border-none bg-transparent text-white">
        <SidebarHeader className="h-16 flex items-center justify-between px-4 border-b border-white/10 relative">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 font-bold text-xl">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">E</div>
              <span>Ace</span>
            </motion.div>
          )}
          <Button variant="ghost" size="icon" onClick={toggle} className="text-neutral-400 hover:text-white absolute right-2 top-3">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarHeader>

        <SidebarContent className="p-2 space-y-2 mt-4">
          <SidebarGroup>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                
                const ItemContent = (
                  <div 
                    className={`w-full justify-${collapsed ? 'center' : 'start'} transition-colors rounded-xl p-3 h-auto flex items-center gap-3 ${
                      isActive ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 hover:text-indigo-300' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                );

                if (collapsed) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <Tooltip>
                        <TooltipTrigger>{ItemContent}</TooltipTrigger>
                        <TooltipContent side="right" className="bg-neutral-800 text-white border-white/10">{item.label}</TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} className="w-full flex">
                      {ItemContent}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </motion.div>
  );
}
