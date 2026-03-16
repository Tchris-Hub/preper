import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Question {
  id: number;
  question: string;
  option: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  section: string;
  image: string;
  answer: string;
  solution: string;
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, string>; // question index -> answer key ('a', 'b', etc)
  timeRemaining: number; // in seconds
  examType: string;
  subject: string;
  year: string;
  isDraft: boolean;
  mode: string;
  
  startQuiz: (examType: string, subject: string, year: string, questions: Question[], totalTime: number, mode?: string) => void;
  setAnswer: (index: number, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  tick: () => void;
  clearQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: 0,
      examType: '',
      subject: '',
      year: '',
      isDraft: false,
      mode: 'normal',
      
      startQuiz: (examType, subject, year, questions, totalTime, mode = 'normal') => set({
        examType, subject, year, questions,
        timeRemaining: totalTime,
        currentQuestionIndex: 0,
        answers: {},
        isDraft: true,
        mode
      }),
      
      setAnswer: (index, answer) => set((state) => ({
        answers: { ...state.answers, [index]: answer }
      })),
      
      nextQuestion: () => set((state) => ({
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1)
      })),
      
      prevQuestion: () => set((state) => ({
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
      })),
      
      goToQuestion: (index) => set({ currentQuestionIndex: index }),
      
      tick: () => set((state) => ({
        timeRemaining: Math.max(state.timeRemaining - 1, 0)
      })),
      
      clearQuiz: () => set({
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: 0,
        examType: '',
        subject: '',
        year: '',
        isDraft: false,
        mode: 'normal'
      })
    }),
    { name: 'quiz-storage' }
  )
);
