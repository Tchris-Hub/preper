"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Mic, Volume2, Loader2, Sparkles, Bookmark, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumAudioPlayer } from "./PremiumAudioPlayer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNotebookStore } from "@/store/useNotebookStore";

export function VoiceTutor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addNote = useNotebookStore((state) => state.addNote);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setIsLoading(true);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/voice-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          history: messages.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const modelMsg = { role: "assistant", text: data.reply };
      setMessages(prev => [...prev, modelMsg]);

      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.reply })
      });

      if (ttsRes.ok) {
        const blob = await ttsRes.blob();
        setAudioUrl(window.URL.createObjectURL(blob));
      }
    } catch (err) {
      toast.error("Grace is having a moment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        animate={isOpen ? { scale: 0.9, rotate: -90 } : { scale: 1, rotate: 0 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-2xl flex items-center justify-center text-white z-50 border-2 border-white/20"
      >
        {isOpen ? <X className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-indigo-500 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 opacity-50" />
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Grace" alt="Grace" className="relative z-10" />
               </div>
               <div>
                 <h3 className="font-bold text-white">Grace — AI Study Partner</h3>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Online & Ready</span>
                 </div>
               </div>
            </div>

            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
               {messages.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-8">
                   <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-indigo-400" />
                   </div>
                   <h4 className="text-white font-bold">Ask me anything!</h4>
                   <p className="text-sm text-neutral-400">"Why do I keep failing Organic Chemistry?" or "How do I manage my time better?"</p>
                 </div>
               )}
               
               {messages.map((m, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={cn(
                     "flex gap-3 max-w-[85%]",
                     m.role === "user" ? "ml-auto flex-row-reverse" : ""
                   )}
                 >
                   <div className={cn(
                     "p-4 rounded-2xl text-sm leading-relaxed relative group/msg",
                     m.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white/5 text-neutral-300 border border-white/5 rounded-tl-none"
                   )}>
                     {m.text}
                     {m.role === "assistant" && (
                       <button 
                         onClick={() => {
                           addNote({ title: "Tutor Tip", content: m.text, type: 'chat' });
                           toast.success("Saved to Notebook!");
                         }}
                         className="absolute -right-10 top-0 opacity-0 group-hover/msg:opacity-100 transition-opacity p-2 text-neutral-500 hover:text-indigo-400 bg-white/5 rounded-full"
                       >
                         <Bookmark className="h-4 w-4" />
                       </button>
                     )}
                   </div>
                 </motion.div>
               ))}

               {isLoading && (
                 <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                       <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                    </div>
                 </div>
               )}
            </div>

            {audioUrl && (
              <div className="px-6 pb-2">
                <PremiumAudioPlayer url={audioUrl} autoPlay className="max-w-full bg-indigo-600/10 border-indigo-500/20" />
              </div>
            )}

            <div className="p-6 border-t border-white/5 bg-black/20">
              <div className="relative flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask Grace a question..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
                />
                <Button onClick={handleSend} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 h-10 w-10 p-0 rounded-xl">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
