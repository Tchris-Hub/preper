"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Loader2, Sparkles, CalendarRange, Headphones, LayoutDashboard, BookOpen, History, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: BookOpen, label: "Exam Setup", href: "/setup" },
  { icon: History, label: "History", href: "/history" },
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const NavLink = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    return (
      <Link 
        key={item.href} 
        href={item.href} 
        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
          isActive ? 'bg-indigo-600/20 text-indigo-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <item.icon className="h-5 w-5" />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-neutral-950 text-white bg-[url('/bg-pattern.svg')]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="h-16 md:hidden border-b border-white/10 bg-black/40 backdrop-blur-md flex flex-shrink-0 items-center px-4">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="text-white hover:bg-white/10" />}>
                  <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-neutral-900 border-r border-white/10 p-0 text-white flex flex-col">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Mobile Navigation</SheetDescription>
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                  <div className="flex items-center gap-2 font-bold text-xl">
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">E</div>
                    <span>Ace Exams</span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                   <div className="space-y-1">
                      <p className="px-3 text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Main</p>
                      {mainNav.map(item => <NavLink key={item.href} item={item} />)}
                   </div>
                   
                   <div className="space-y-1">
                      <p className="px-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">AI Superpowers</p>
                      {aiNav.map(item => <NavLink key={item.href} item={item} />)}
                   </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-white/[0.02] space-y-1">
                   <p className="px-3 text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Account</p>
                   {bottomNav.map(item => <NavLink key={item.href} item={item} />)}
                </div>
              </SheetContent>
            </Sheet>
            <div className="ml-4 font-bold text-lg tracking-tight">Ace Exams</div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
