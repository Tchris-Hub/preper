"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signIn, signInWithGoogle } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isRegistered = searchParams.get("registered") === "true";

  useEffect(() => {
    if (isRegistered) {
      toast.info("Please verify your email", {
        description: "Check your inbox and junk/spam folder for the confirmation link.",
        duration: 8000,
      });
    }
  }, [isRegistered]);

  const [identifier, setIdentifier] = useState(""); // Email or Username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("identifier", identifier);
    formData.append("password", password);

    const result = await signIn(formData);

    if (result?.error) {
      toast.error(result.error);
      if (result.needsConfirmation) {
        toast.info("A new confirmation email will be sent if needed.");
      }
      setLoading(false);
      return;
    }

    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier" className="text-neutral-300">Email or Username</Label>
        <Input 
          id="identifier" 
          type="text"
          placeholder="Enter your email or username" 
          required 
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="bg-black/20 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-indigo-500"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-neutral-300">Password</Label>
          <Link href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            Forgot password?
          </Link>
        </div>
        <Input 
          id="password" 
          type="password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-black/20 border-white/10 text-white focus-visible:ring-indigo-500"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all rounded-xl mt-2 h-12 text-base font-bold hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-[0.98]"
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#050505] px-2 text-neutral-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 rounded-xl h-12"
        onClick={async () => {
          setLoading(true);
          const result = await signInWithGoogle();
          if (result?.error) {
            toast.error(result.error);
            setLoading(false);
          }
        }}
        disabled={loading}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="text-neutral-400">Enter your credentials to access your account</p>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      }>
        <LoginForm />
      </Suspense>

      <div className="text-center text-sm text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign up
        </Link>
      </div>
    </div>
  );
}
