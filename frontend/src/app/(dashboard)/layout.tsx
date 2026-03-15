"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, History, LayoutDashboard, Settings, UserCircle } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: BookOpen, label: "Exam Setup", href: "/setup" },
  { icon: History, label: "History", href: "/history" },
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

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-neutral-950 text-white bg-[url('/bg-pattern.svg')]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="h-16 md:hidden border-b border-white/10 bg-black/40 backdrop-blur-md flex flex-shrink-0 items-center px-4">
            <Sheet>
              <SheetTrigger>
                <div className="md:hidden text-white hover:bg-white/10 p-2 rounded-md inline-flex items-center justify-center">
                  <Menu className="h-5 w-5" />
                </div>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-neutral-900 border-r border-white/10 p-0 text-white">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Mobile Navigation</SheetDescription>
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                  <div className="flex items-center gap-2 font-bold text-xl">
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">E</div>
                    <span>Ace Exams</span>
                  </div>
                </div>
                <nav className="p-4 space-y-2">
                  {navItems.map((item) => {
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
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
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
