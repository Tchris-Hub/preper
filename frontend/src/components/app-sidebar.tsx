"use client";

import { useSidebarStore } from "@/store/useSidebarStore";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  BookOpen, History, LayoutDashboard, Settings, UserCircle, Menu, 
  Sparkles, CalendarRange, Headphones, BrainCircuit 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mainNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: BookOpen, label: "Exam Setup", href: "/setup" },
  { icon: History, label: "Results History", href: "/history" },
];

const aiNav = [
  { icon: Sparkles, label: "AI Results Hub", href: "/analytics" },
  { icon: CalendarRange, label: "Study Planner", href: "/planner" },
  { icon: Headphones, label: "Audio Recaps", href: "/recaps" },
];

const bottomNav = [
  { icon: UserCircle, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function AppSidebar() {
  const { collapsed, toggle } = useSidebarStore();
  const pathname = usePathname();

  const NavItem = ({ item, isBottom = false }: { item: any; isBottom?: boolean }) => {
    const isActive = pathname === item.href;
    
    const content = (
      <div 
        className={cn(
          "w-full transition-all duration-200 rounded-xl p-3 h-auto flex items-center gap-3 group/item",
          collapsed ? "justify-center" : "justify-start",
          isActive 
            ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]" 
            : "text-neutral-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <item.icon className={cn(
          "h-5 w-5 shrink-0 transition-transform group-hover/item:scale-110",
          item.href.includes('/recaps') || item.href.includes('/dashboard') ? "text-indigo-400" : ""
        )} />
        {!collapsed && (
          <span className="font-semibold text-sm tracking-tight">{item.label}</span>
        )}
      </div>
    );

    return (
      <SidebarMenuItem key={item.href}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger render={<Link href={item.href} className="w-full" />}>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-neutral-800 text-white border-white/10">{item.label}</TooltipContent>
          </Tooltip>
        ) : (
          <Link href={item.href} className="w-full flex">
            {content}
          </Link>
        )}
      </SidebarMenuItem>
    );
  };

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ type: "spring", damping: 25, stiffness: 180 }}
      className="h-screen flex-shrink-0 relative overflow-hidden hidden md:block border-r border-white/10 bg-black/40 backdrop-blur-xl"
    >
      <Sidebar collapsible="icon" className="w-full h-full border-none bg-transparent text-white flex flex-col">
        <SidebarHeader className="h-16 flex items-center justify-between px-4 border-b border-white/10 relative">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 font-bold text-xl">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">E</div>
              <span className="tracking-tighter uppercase font-black">Ace Exams</span>
            </motion.div>
          )}
          <Button variant="ghost" size="icon" onClick={toggle} className="text-neutral-400 hover:text-white absolute right-2 top-3">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto px-2 space-y-6 mt-6 custom-scrollbar">
          <SidebarGroup>
            {!collapsed && <p className="px-3 text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Main</p>}
            <SidebarMenu className="space-y-1">
              {mainNav.map((item) => <NavItem key={item.href} item={item} />)}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            {!collapsed && (
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">AI Power</p>
                <BrainCircuit className="h-3 w-3 text-indigo-500 animate-pulse" />
              </div>
            )}
            <SidebarMenu className="space-y-1">
              {aiNav.map((item) => <NavItem key={item.href} item={item} />)}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2 border-t border-white/5 bg-white/[0.02]">
           {!collapsed && <p className="px-3 text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Account</p>}
           <SidebarMenu className="space-y-1">
              {bottomNav.map((item) => <NavItem key={item.href} item={item} />)}
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </motion.div>
  );
}
