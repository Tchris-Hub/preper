"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
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

    const supabase = createClient();
    let loginEmail = identifier;

    // If identifier doesn't look like an email, try to resolve it as a username
    if (!identifier.includes("@")) {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", identifier)
        .single();
      
      if (profileError || !data?.email) {
        toast.error("Account not found with that username.");
        setLoading(false);
        return;
      }
      loginEmail = data.email;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      toast.error(error.message);
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
