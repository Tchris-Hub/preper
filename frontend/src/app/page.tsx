"use client";

import { motion } from "framer-motion";
import { Sparkles, Mic, Globe, Zap, Shield, Play, ArrowRight, CheckCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Ace Your Exams</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
           <a href="#features" className="hover:text-white transition-colors">Features</a>
           <Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>
           <Link href="/how-it-works#plans" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-neutral-400 hover:text-white">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full"
        >
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Powered by ElevenLabs AI</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40"
        >
          STUDY WITH <br /> <span className="text-indigo-500">EMOTION.</span> PASS WITH <br /> PRIDE.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-12 leading-relaxed"
        >
          The first voice-enabled exam prep platform in Nigeria. Don't just read past questions—listen to "Grace", your personal AI tutor who understands your struggle and guides you to success.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/login">
            <Button className="h-16 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-[0_20px_40px_rgba(79,70,229,0.3)] group transition-all hover:scale-105">
              Start Free Practice
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 hover:bg-white/5 text-lg font-bold backdrop-blur-xl">
             Watch Demo
             <Play className="ml-2 h-5 w-5 fill-white" />
          </Button>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
         <motion.div 
           initial="hidden" 
           whileInView="visible" 
           viewport={{ once: true, margin: "-100px" }}
           variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
           className="grid md:grid-cols-3 gap-8"
         >
            <FeatureCard 
              icon={<Mic className="h-6 w-6 text-indigo-400" />}
              title="AI Voice Coaching"
              description="Hear spoken explanations for every wrong answer. Our vocal coach sounds human, patient, and encouraging."
              delay={0}
            />
            <FeatureCard 
              icon={<Globe className="h-6 w-6 text-purple-400" />}
              title="Multilingual Support"
              description="Learn in Igbo, Yoruba, Hausa or Pidgin. Conceptual understanding is deeper in your native tongue."
              delay={1}
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-emerald-400" />}
              title="Exam Accuracy"
              description="100% Verified JAMB/WAEC past questions with intelligent grading that actually counts every point."
              delay={2}
            />
         </motion.div>
      </section>

      {/* Show the Soul */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="bg-gradient-to-tr from-indigo-900/40 to-black border border-indigo-500/20 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full" />
            
            <div className="flex-1 space-y-8 relative z-10">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">Meet Grace: <br /> <span className="text-indigo-400">Your Study Sister.</span></h2>
               <p className="text-neutral-400 text-lg leading-relaxed">
                  Most platforms just tell you that you're wrong. Grace tells you <b>how</b> to get it right next time. She uses local analogies—like mixing Garri or Lagos traffic—to make complex Chemistry and Math concepts stick forever.
               </p>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-neutral-300 font-medium">
                     <CheckCircle className="h-5 w-5 text-indigo-400" /> Conversational AI Tutor
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300 font-medium">
                     <CheckCircle className="h-5 w-5 text-indigo-400" /> Emotional Resilience Tracking
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300 font-medium">
                     <CheckCircle className="h-5 w-5 text-indigo-400" /> Personal Voice Cloning
                  </li>
               </ul>
            </div>

            <div className="flex-1 relative">
               <div className="w-full aspect-square bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl flex items-center justify-center relative group overflow-hidden">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }} 
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="h-48 w-48 rounded-full bg-indigo-600/20 flex items-center justify-center p-4 border-4 border-indigo-500/30"
                  >
                     <div className="h-32 w-32 rounded-full border-4 border-dashed border-indigo-400/50 animate-[spin_10s_linear_infinite]" />
                     <Mic className="h-16 w-16 text-indigo-400 absolute" />
                  </motion.div>
                  {/* Floating tags */}
                  <div className="absolute top-12 left-12 bg-black/80 px-4 py-2 rounded-xl text-xs font-bold border border-white/10">"Dont worry, you'll get it!"</div>
                  <div className="absolute bottom-12 right-12 bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold">Vocalizing Explanation...</div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <footer className="py-32 px-6 text-center relative">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[150px] rounded-full" />
         </div>
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="relative z-10"
         >
           <h3 className="text-3xl md:text-5xl font-black mb-8 text-gradient">Ready to ace your exams?</h3>
           <Link href="/login">
              <Button className="h-16 px-12 rounded-2xl bg-white text-black hover:bg-neutral-200 text-lg font-bold glow-indigo hover:scale-105 transition-transform">
                 Join 5,000+ Nigerian Students
              </Button>
           </Link>
           <p className="mt-8 text-neutral-500 text-sm">Join the evolution of education. Ace Your Exams 2026.</p>
         </motion.div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay = 0 }: any) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
      }}
      className="glass-card glass-card-hover p-8 rounded-[2rem] group relative overflow-hidden noise-overlay"
    >
       <div className="relative z-10">
         <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            {icon}
         </div>
         <h4 className="text-xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">{title}</h4>
         <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
       </div>
    </motion.div>
  );
}
