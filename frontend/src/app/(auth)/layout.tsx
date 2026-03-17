import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-900 bg-[url('/bg-pattern.svg')] lg:grid lg:grid-cols-2 relative">
      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/8 blur-[120px] rounded-full" />
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center bg-black/40 backdrop-blur-sm p-12 text-white border-r border-white/10 relative overflow-hidden noise-overlay">
        <div className="max-w-md space-y-6 relative z-10">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 glow-indigo">
            <span className="text-3xl font-bold">E</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gradient">Ace Your Exams.</h1>
          <p className="text-lg text-neutral-300">
            Premium CBT practice platform for JAMB, WAEC, NECO, and POST-UTME candidates. Track your progress, identify weak areas, and score higher.
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-center p-6 lg:p-12 min-h-screen relative z-10">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
          <div className="glass-card rounded-3xl p-8 shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
