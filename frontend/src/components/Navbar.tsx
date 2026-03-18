"use client";

import { useState } from "react";
import { Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "Pricing", href: "/how-it-works#plans" },
  ];

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/5 backdrop-blur-md w-full">
      <Link href="/" className="flex items-center gap-2 group shrink-0">
        <div className="h-9 w-9 sm:h-10 sm:w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-transform group-hover:scale-110">
          <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <span className="text-lg sm:text-xl font-black tracking-tighter uppercase text-white truncate max-w-[150px] sm:max-w-none">Ace Your Exams</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`hover:text-white transition-colors ${
              pathname === link.href ? "text-white font-bold" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-neutral-400 hover:text-white px-4">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 font-bold">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="text-white md:hidden flex-shrink-0" />
            }
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-neutral-950 border-white/10 text-white p-8">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-500" />
                ACE YOUR EXAMS
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-neutral-400 hover:text-indigo-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-4" />
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-lg font-bold">
                  Sign In
                </Button>
              </Link>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-14 rounded-2xl bg-indigo-600 text-lg font-bold">
                  Get Started
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
