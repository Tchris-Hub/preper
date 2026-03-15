import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-900 bg-[url('/bg-pattern.svg')] lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-black/40 backdrop-blur-sm p-12 text-white border-r border-white/10">
        <div className="max-w-md space-y-6">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold">E</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">Ace Your Exams.</h1>
          <p className="text-lg text-neutral-300">
            Premium CBT practice platform for JAMB, WAEC, NECO, and POST-UTME candidates. Track your progress, identify weak areas, and score higher.
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-center p-6 lg:p-12 min-h-screen">
        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
