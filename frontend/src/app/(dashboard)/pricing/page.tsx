"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";

interface Plan {
  id: number;
  name: string;
  price: string;
  duration_days: number;
  features: any;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/subscriptions/plans/");
        setPlans(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          Unlock your full potential with unlimited access to past questions, detailed explanations, and advanced performance analytics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
        {plans.map((plan) => {
          const isPremium = plan.name.toLowerCase().includes('premium');
          const isUserPlan = user?.subscription_tier === plan.name.toUpperCase();
          
          return (
            <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 ${
              isPremium 
                ? 'scale-105 bg-gradient-to-b from-indigo-900/50 to-black/60 border-indigo-500 shadow-2xl shadow-indigo-500/20 z-10' 
                : 'bg-black/40 border-white/10 backdrop-blur-md'
            }`}>
              {isPremium && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              )}
              {isUserPlan && (
                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  Current Plan
                </div>
              )}
              
              <CardHeader className="text-center pt-8">
                {isPremium && <Crown className="w-10 h-10 mx-auto text-indigo-400 mb-4" />}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>Valid for {plan.duration_days} days</CardDescription>
                <div className="mt-4 flex items-baseline justify-center text-5xl font-extrabold">
                  ₦{parseFloat(plan.price).toLocaleString()}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features?.items?.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-neutral-300">
                      <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {/* Fallback if features not structured right */}
                  {!plan.features?.items && (
                    <li className="flex items-start text-sm text-neutral-300">
                      <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                      <span>Full Access</span>
                    </li>
                  )}
                </ul>
              </CardContent>
              
              <CardFooter className="pb-8">
                <Button 
                  disabled={isUserPlan}
                  className={`w-full rounded-xl h-12 text-lg font-bold transition-all ${
                    isUserPlan ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' :
                    isPremium 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105' 
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  {isUserPlan ? 'Active' : isPremium ? <><Sparkles className="mr-2 h-5 w-5" /> Subscribe Now</> : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}

        {/* Static Free Tier Card if not returned from backend */}
        {plans.length > 0 && !plans.find(p => p.price === '0.00') && (
          <Card className="bg-black/40 border-white/10 backdrop-blur-md">
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Always free</CardDescription>
              <div className="mt-4 flex items-baseline justify-center text-5xl font-extrabold">
                ₦0
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start text-sm text-neutral-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                  <span>5 mock exams per day</span>
                </li>
                <li className="flex items-start text-sm text-neutral-300">
                  <Check className="h-5 w-5 text-emerald-500 mr-2 shrink-0" />
                  <span>Basic performance tracking</span>
                </li>
                <li className="flex items-start text-sm text-neutral-300 opacity-50">
                  <div className="h-5 w-5 rounded-full border-2 border-neutral-600 mr-2 shrink-0" />
                  <span>Deep Analytics</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pb-8">
              <Button disabled className="w-full rounded-xl h-12 text-lg font-bold bg-neutral-800 text-neutral-500">
                Default Plan
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
