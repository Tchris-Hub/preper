"use client";

import { useNotebookStore } from "@/store/useNotebookStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Book, Calendar, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function NotebookPage() {
  const { notes, removeNote, clearNotes } = useNotebookStore();

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 lg:p-12 w-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <Book className="h-8 w-8 text-indigo-500" />
              Your Study Notebook
            </h1>
            <p className="text-neutral-500">All your saved AI explanations and study tips in one place.</p>
          </div>
          {notes.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearNotes} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
               Clear All
            </Button>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
            <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold">Your notebook is empty</h3>
            <p className="text-neutral-500 max-w-xs mx-auto text-sm leading-relaxed">
              When you use the AI Tutor or hear an explanation, click the bookmark icon to save it here forever.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <Card className="bg-white/5 border-white/10 overflow-hidden rounded-2xl group transition-all hover:border-indigo-500/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            {note.type === 'chat' ? <MessageSquare className="h-4 w-4 text-indigo-400" /> : <Sparkles className="h-4 w-4 text-indigo-400" />}
                         </div>
                         <div>
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-indigo-300">{note.title}</CardTitle>
                            <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-medium">
                               <Calendar className="h-3 w-3" />
                               {format(note.createdAt, 'MMM d, h:mm a')}
                            </div>
                         </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeNote(note.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {note.content.replace(/\[.*?\]/g, '')}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
