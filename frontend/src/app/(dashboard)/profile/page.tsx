"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Mail, Phone, Crown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Profile saving will be implemented soon.");
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-neutral-400">Manage your personal information and subscription.</p>
        </div>
        <Button onClick={handleLogout} variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0">
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-white/10 backdrop-blur-md md:col-span-1 border-t-4 border-t-indigo-500">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
              <span className="text-4xl font-bold">{user.first_name?.[0]}{user.last_name?.[0]}</span>
            </div>
            <CardTitle className="text-xl">{user.first_name} {user.last_name}</CardTitle>
            <CardDescription>@{user.username}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`mx-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              user.subscription_tier === 'PREMIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}>
              <Crown className="w-3.5 h-3.5" />
              {user.subscription_tier} PLAN
            </div>
            {user.subscription_tier === 'FREE' && (
              <Button onClick={() => router.push('/pricing')} variant="outline" className="w-full bg-indigo-600/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-600/20">
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-white/10 backdrop-blur-md md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Update your contact information.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue={user.first_name} className="bg-black/20 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue={user.last_name} className="bg-black/20 border-white/10 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                  <Input defaultValue={user.email} className="bg-black/20 border-white/10 text-white pl-9" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                  <Input defaultValue={user.phone || ''} placeholder="Add phone number" className="bg-black/20 border-white/10 text-white pl-9" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4">
              <Button type="submit" className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
