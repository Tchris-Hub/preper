"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Check, Loader2, Music, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

export function CloneVoiceCard() {
  const { user } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [clonedVoiceId, setClonedVoiceId] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", `${user?.first_name}'s Private Tutor`);

    try {
      const res = await fetch("/api/clone-voice", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.voice_id) {
        setClonedVoiceId(data.voice_id);
        toast.success("Voice cloned successfully!", {
          description: "Your explanations will now use this voice."
        });
        // In a real app, save voice_id to user profile in DB
      } else {
        throw new Error(data.error || "Failed to clone");
      }
    } catch (err) {
      toast.error("Cloning failed", { description: "Please ensure the audio is clear and at least 30 seconds." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/40 border-indigo-500/20 backdrop-blur-md rounded-3xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
         <div className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
            Premium Feature
         </div>
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Music className="h-5 w-5 text-indigo-400" />
          Clone Your Favorite Tutor
        </CardTitle>
        <CardDescription>
          Upload a 30-60 second audio clip of your teacher, parent, or favorite mentor to hear their voice explain your study materials.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!clonedVoiceId ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10 transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="voice-upload"
              />
              <label htmlFor="voice-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-neutral-300">
                  {file ? file.name : "Select Audio Sample"}
                </span>
                <span className="text-xs text-neutral-500">MP3, WAV (Max 5MB)</span>
              </label>
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={!file || loading} 
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              {loading ? "Cloning Voice..." : "Clone Voice Now"}
            </Button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                 <Check className="h-6 w-6 text-emerald-500" />
               </div>
               <div>
                  <p className="font-bold text-white uppercase tracking-tight text-sm">Active Voice Clone</p>
                  <p className="text-xs text-neutral-400">Explanations will use your custom voice.</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setClonedVoiceId(null)} className="text-red-400 hover:bg-red-500/10">
               <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        <div className="p-4 bg-white/5 rounded-xl">
           <p className="text-[11px] text-neutral-500 leading-relaxed italic">
             "Hearing my mom's voice explain simultaneous equations made me feel like she was right there with me while she was working away at her second job."
             <br />— Chiamaka, 2026 Student
           </p>
        </div>
      </CardContent>
    </Card>
  );
}
