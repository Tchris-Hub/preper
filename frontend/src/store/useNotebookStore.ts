import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  subject?: string;
  type: 'explanation' | 'chat' | 'own';
}

interface NotebookState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  removeNote: (id: string) => void;
  clearNotes: () => void;
}

export const useNotebookStore = create<NotebookState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (newNote) => set((state) => ({
        notes: [
          {
             ...newNote,
             id: Math.random().toString(36).substring(7),
             createdAt: Date.now()
          },
          ...state.notes
        ]
      })),
      removeNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),
      clearNotes: () => set({ notes: [] })
    }),
    { name: 'ace-notebook' }
  )
);
