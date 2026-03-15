"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register/", formData);
      toast.success("Account created successfully. Please sign in.");
      router.push("/login");
    } catch (error: any) {
      const errMessage = error.response?.data ? Object.values(error.response.data)[0] : "Registration failed";
      toast.error(errMessage as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-white">Create an account</h1>
        <p className="text-neutral-400">Start your prep journey for free.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-neutral-300">First Name</Label>
            <Input id="first_name" required value={formData.first_name} onChange={handleChange} className="bg-black/20 border-white/10 text-white focus-visible:ring-indigo-500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-neutral-300">Last Name</Label>
            <Input id="last_name" required value={formData.last_name} onChange={handleChange} className="bg-black/20 border-white/10 text-white focus-visible:ring-indigo-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username" className="text-neutral-300">Username</Label>
          <Input id="username" required value={formData.username} onChange={handleChange} className="bg-black/20 border-white/10 text-white focus-visible:ring-indigo-500" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-neutral-300">Email Address</Label>
          <Input id="email" type="email" required value={formData.email} onChange={handleChange} className="bg-black/20 border-white/10 text-white focus-visible:ring-indigo-500" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-neutral-300">Password</Label>
          <Input id="password" type="password" required value={formData.password} onChange={handleChange} className="bg-black/20 border-white/10 text-white focus-visible:ring-indigo-500" />
        </div>
        
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all rounded-xl mt-2" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
        </Button>
      </form>

      <div className="text-center text-sm text-neutral-400">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
}
