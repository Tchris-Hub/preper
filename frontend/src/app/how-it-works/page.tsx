"use client";

import { motion } from "framer-motion";
import { Sparkles, Mic, Globe, Zap, Shield, Play, ArrowRight, CheckCircle, BookOpen, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
    buttonText: "Start Learning",
    current: false,
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
    buttonText: "Join Unlimited",
    highlight: true,
  }
];

const steps = [
  {
    title: "Sign Up & Choose Your Exam",
    description: "Create your account in seconds and select from JAMB, WAEC, or NECO past questions.",
    icon: <UserPlus className="h-6 w-6 text-indigo-400" />,
  },
  {
    title: "Practice with Precision",
    description: "Take timed mock exams that mimic the real CBT environment. We track your timing and accuracy.",
    icon: <Play className="h-6 w-6 text-purple-400" />,
  },
  {
    title: "Hear the 'Grace' Difference",
    description: "Instead of just seeing a red 'X', listen to Grace explain why you missed it in a language you understand.",
    icon: <Mic className="h-6 w-6 text-emerald-400" />,
  },
  {
    title: "Track & Conquer",
    description: "Watch your performance trends and focus on your weak areas with AI-generated study plans.",
    icon: <Zap className="h-6 w-6 text-orange-400" />,
  }
];

function UserPlus(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    )
  }

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only fixed top-4 left-4 z-[100] bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">
        Skip to content
      </a>
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section id="main-content" className="relative pt-20 pb-20 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full"
        >
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Your Journey to Success</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.1] md:leading-none mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40"
        >
          HOW IT <span className="text-indigo-500">WORKS.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl text-neutral-400 max-w-2xl mb-10 md:mb-12 leading-relaxed px-4 md:px-0"
        >
          Step into a smarter way of studying. We combine verified past questions with advanced AI voice technology to ensure you don't just memorize—you understand.
        </motion.p>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
                <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl relative group overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6 font-black italic">{i + 1}</span>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{step.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Detailed Feature Explanation */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 relative z-10">
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">Voice-Enabled <br /> <span className="text-indigo-400">CBT Practice.</span></h2>
               <div className="space-y-6">
                   <p className="text-neutral-400 text-lg leading-relaxed">
                      Traditional CBT platforms are boring. You click, you fail, you move on. With Ace Your Exams, every incorrect answer is an opportunity for a conversation.
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="flex items-center gap-3 text-neutral-300 bg-white/5 p-4 rounded-2xl border border-white/5 transition-colors hover:border-indigo-500/30">
                          <CheckCircle className="h-5 w-5 text-indigo-400" /> 
                          <span className="font-medium">Real-time Feedback</span>
                       </div>
                       <div className="flex items-center gap-3 text-neutral-300 bg-white/5 p-4 rounded-2xl border border-white/5 transition-colors hover:border-indigo-500/30">
                          <CheckCircle className="h-5 w-5 text-indigo-400" /> 
                          <span className="font-medium">Vocal Explanations</span>
                       </div>
                       <div className="flex items-center gap-3 text-neutral-300 bg-white/5 p-4 rounded-2xl border border-white/5 transition-colors hover:border-indigo-500/30">
                          <CheckCircle className="h-5 w-5 text-indigo-400" /> 
                          <span className="font-medium">Multi-pass Grading</span>
                       </div>
                       <div className="flex items-center gap-3 text-neutral-300 bg-white/5 p-4 rounded-2xl border border-white/5 transition-colors hover:border-indigo-500/30">
                          <CheckCircle className="h-5 w-5 text-indigo-400" /> 
                          <span className="font-medium">Offline Support</span>
                       </div>
                   </div>
               </div>
            </div>

            <div className="flex-1 relative">
                <div className="w-full aspect-[4/3] bg-neutral-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent" />
                    <div className="p-8 h-full flex flex-col justify-center items-center gap-6">
                        <div className="flex gap-2">
                           {[1,2,3,4,5].map(i => (
                               <motion.div 
                                 key={i}
                                 animate={{ height: [10, 40, 20, 50, 10] }}
                                 transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                                 className="w-2 bg-indigo-500 rounded-full"
                               />
                           ))}
                        </div>
                        <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center">
                            <p className="text-white font-bold italic">"Let me explain the Chemistry of that reaction..."</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Pricing/Plans Section */}
      <section id="plans" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
         <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Choose Your <span className="text-indigo-500">Path.</span></h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Simple, transparent pricing for everyone. Whether you're just starting or aiming for the top score.</p>
         </div>

         <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
           {plans.map((plan, i) => (
             <motion.div
               key={plan.name}
               initial={{ opacity: 0, scale: 0.9, x: i === 0 ? -20 : 20 }}
               whileInView={{ opacity: 1, scale: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
             >
               <Card className={cn(
                 "bg-black/40 border-white/10 backdrop-blur-xl rounded-[2.5rem] relative overflow-hidden transition-all duration-500 h-full flex flex-col text-white",
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
                   <CardDescription className="text-neutral-400">{plan.description}</CardDescription>
                 </CardHeader>
                 
                 <CardContent className="p-8 pt-4 space-y-6 flex-1">
                   <div className="flex items-baseline gap-1">
                     <span className="text-4xl font-black text-white">₦{plan.price}</span>
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
                   <Link href="/login" className="w-full">
                       <Button 
                         className={cn(
                         "w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300",
                         plan.highlight 
                           ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20" 
                           : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                         )}
                         variant={plan.highlight ? "default" : "outline"}
                       >
                         {plan.buttonText}
                       </Button>
                   </Link>
                 </CardFooter>
               </Card>
             </motion.div>
           ))}
         </div>
      </section>

      {/* CTA Section */}
      <footer className="py-32 px-6 text-center relative border-t border-white/5">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[150px] rounded-full" />
         </div>
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="relative z-10"
         >
           <h3 className="text-3xl md:text-5xl font-black mb-8">Ready to ace your exams?</h3>
           <Link href="/login">
              <Button className="h-16 px-12 rounded-2xl bg-white text-black hover:bg-neutral-200 text-lg font-bold shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform">
                 Join 5,000+ Nigerian Students
              </Button>
           </Link>
           <p className="mt-8 text-neutral-500 text-sm">Join the evolution of education. Ace Your Exams 2026.</p>
         </motion.div>
      </footer>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
