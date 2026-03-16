"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Shield, Moon, Monitor, CreditCard } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Fetch plans
    api.get('/subscriptions/plans/')
      .then((res) => setPlans(res.data))
      .catch((err) => console.error("Could not load plans", err));
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-neutral-400">Manage your app preferences and settings.</p>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-indigo-400" /> Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks on your device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-white">Dark Mode</Label>
              <p className="text-sm text-neutral-500">Protect your eyes in low light.</p>
            </div>
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')} 
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-400" /> Notifications
          </CardTitle>
          <CardDescription>Choose what updates you want to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-white">Exam Reminders</Label>
              <p className="text-sm text-neutral-500">Get notified about your scheduled study times.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-white">Performance Reports</Label>
              <p className="text-sm text-neutral-500">Weekly summaries of your progress via email.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" /> Security
          </CardTitle>
          <CardDescription>Manage your account security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-white">Two-Factor Authentication</Label>
              <p className="text-sm text-neutral-500">Add an extra layer of security to your account.</p>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-400" /> Subscription Plan
          </CardTitle>
          <CardDescription>Manage your premium access and billing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-white">Current Tier: {user?.subscription_tier === 'PAID' ? 'Premium (Unlimited)' : 'Free (5 Exams/Day)'}</Label>
              <p className="text-sm text-neutral-500">
                {user?.subscription_tier === 'PAID' ? 'You have unlocked all features, including AI Explanations.' : 'Upgrade to Premium for unlimited mock exams and voice explanations.'}
              </p>
            </div>
            {user && user.subscription_tier !== 'PAID' && (
              <Button 
                onClick={async () => {
                  setLoading(true);
                  try {
                    const planId = plans.length > 0 ? plans[0].id : 1;
                    const res = await api.post('/subscriptions/paystack/initialize/', { plan_id: planId });
                    if (res.data?.data?.authorization_url) {
                      window.location.href = res.data.data.authorization_url;
                    } else if (res.data?.authorization_url) {
                      window.location.href = res.data.authorization_url;
                    } else {
                      throw new Error('No auth url returned');
                    }
                  } catch (err: any) {
                    toast.error("Checkout Error", { description: err.response?.data?.error || "Could not start checkout" });
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Loading..." : "Upgrade Now (₦2,000)"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
