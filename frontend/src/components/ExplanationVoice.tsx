import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, Loader2, Lock } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface ExplanationVoiceProps {
  text: string;
}

export function ExplanationVoice({ text }: ExplanationVoiceProps) {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { user } = useAuthStore();
  const router = useRouter();

  const speakExplanation = async () => {
    if (user?.subscription_tier !== 'PAID') {
      toast.error("Premium Feature", {
        description: "Please upgrade to Premium to use Voice Explanations."
      });
      router.push('/settings');
      return;
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/exams/tts/', { text }, {
        responseType: 'blob'
      });
      
      const blob = new Blob([res.data], { type: 'audio/mpeg' });
      const url = window.URL.createObjectURL(blob);
      setAudioUrl(url);
      
      const audio = new Audio(url);
      audio.play();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error("Premium Feature", { description: "Please upgrade to use voice features." });
        router.push('/settings');
      } else {
        toast.error("Error", { description: "Failed to generate audio." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={speakExplanation} 
      disabled={loading}
      className="ml-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/20"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : user?.subscription_tier === 'PAID' ? (
        <Volume2 className="h-4 w-4 mr-2" />
      ) : (
        <Lock className="h-4 w-4 mr-2" />
      )}
      {loading ? "Generating Audio..." : "Listen to Explanation"}
    </Button>
  );
}
