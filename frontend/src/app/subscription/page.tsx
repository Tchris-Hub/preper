"use client";

import { Check, Flame, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const plans = [
  {
    name: "Free Learner",
    price: "0",
    description: "Perfect for casual practice.",
    features: [
      "5 Mock Exams Per Day",
      "Standard Performance Table",
      "Text Explanations",
      "Community Access",
    ],
    buttonText: "Current Plan",
    current: true,
  },
  {
    name: "Ace Unlimited",
    price: "1,500",
    description: "The choice of toppers. No limits.",
    features: [
      "Unlimited Mock Exams",
      "Voice Tutor (Grace) Access",
      "Interactive AI Explanations",
      "Personalized Study Briefings",
      "Voice Cloning (Personal Tutor)",
      "Ad-free Experience",
    ],
    buttonText: "Upgrade to Unlimited",
    highlight: true,
  }
];

export default function SubscriptionPage() {
  const { user } = useAuthStore();

  const handleUpgrade = async () => {
    toast.info("Connecting to Payment Gateway...", {
      description: "You're one step away from exam success!"
    });
    // Implementation for Paystack/Flutterwave would go here
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 lg:p-12 overflow-y-auto w-full">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient"
          >
            Unlock Your Potential
          </motion.h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Give yourself the competitive edge with our AI-powered premium features. 
            Because your future is worth the investment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.9, x: i === 0 ? -20 : 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={cn(
                "bg-black/40 border-white/10 backdrop-blur-xl rounded-[2.5rem] relative overflow-hidden transition-all duration-500",
                plan.highlight ? "border-indigo-500/50 shadow-[0_0_50px_rgba(79,70,229,0.2)] scale-105 z-10" : ""
              )}>
                {plan.highlight && (
                  <div className="absolute top-0 right-12 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-b-xl uppercase tracking-widest shadow-xl">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center",
                      plan.highlight ? "bg-indigo-600 shadow-lg shadow-indigo-600/30" : "bg-white/5"
                    )}>
                      {plan.highlight ? <Zap className="h-6 w-6 text-white" /> : <Star className="h-6 w-6 text-indigo-400" />}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-neutral-500">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">₦{plan.price}</span>
                    <span className="text-neutral-500 font-medium">/month</span>
                  </div>

                  <div className="space-y-4">
                    {plan.features.map(feat => (
                      <div key={feat} className="flex items-center gap-3">
                        <div className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                          plan.highlight ? "bg-indigo-500/20 text-indigo-400" : "bg-emerald-500/20 text-emerald-400"
                        )}>
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm text-neutral-300 font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-8 pt-0">
                  <Button 
                    onClick={plan.highlight ? handleUpgrade : undefined}
                    className={cn(
                    "w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300",
                    plan.highlight 
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20" 
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    )}
                    variant={plan.highlight ? "default" : "outline"}
                    disabled={plan.name === "Free Learner" && user?.subscription_tier === "FREE"}
                  >
                    {plan.name === "Free Learner" && user?.subscription_tier === "FREE" ? "Active Plan" : plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center max-w-3xl mx-auto backdrop-blur-md">
           <h3 className="font-bold text-xl mb-4">Studying in a group?</h3>
           <p className="text-neutral-400 mb-6 text-sm">
             We offer discounted rates for schools and study centers. 
             Contact us to get bulk access for your students.
           </p>
           <Button variant="link" className="text-indigo-400 font-bold underline">
             Contact Sales Support
           </Button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
