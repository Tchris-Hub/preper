"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Mail, Crown, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProfileSkeleton } from "@/components/ui/skeleton-premium";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  subscription_tier: string;
  avatar_url: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setUsername(data.username || "");
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        username: username,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated!");
      setProfile({ ...profile, full_name: fullName, username });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="skeleton h-9 w-32" />
        <div className="grid md:grid-cols-3 gap-6">
          <ProfileSkeleton />
          <div className="md:col-span-2 glass-card rounded-xl p-8 space-y-4">
            <div className="skeleton h-6 w-40" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const nameParts = (profile.full_name || "").split(" ");
  const initials = nameParts.map(n => n[0]).join("").toUpperCase() || "?";

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
        <Card className="glass-card md:col-span-1 border-t-4 border-t-indigo-500">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
              <span className="text-4xl font-bold">{initials}</span>
            </div>
            <CardTitle className="text-xl">{profile.full_name || "No name set"}</CardTitle>
            <CardDescription>@{profile.username || "no-username"}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className={`mx-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              profile.subscription_tier === 'premium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}>
              <Crown className="w-3.5 h-3.5" />
              {profile.subscription_tier.toUpperCase()} PLAN
            </div>
            {profile.subscription_tier === 'free' && (
              <Button onClick={() => router.push('/subscription')} variant="outline" className="w-full bg-indigo-600/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-600/20">
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSave}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-black/20 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-black/20 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                  <Input defaultValue={profile.email || ""} className="bg-black/20 border-white/10 text-white pl-9" readOnly />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4">
              <Button type="submit" className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
