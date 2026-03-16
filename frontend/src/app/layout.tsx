import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ace Your Exams | Premium CBT Platform',
  description: 'JAMB, WAEC, NECO CBT prep platform',
};

import { VoiceTutor } from '@/components/VoiceTutor';
import { MotivationalGrace } from '@/components/MotivationalGrace';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <VoiceTutor />
            <MotivationalGrace />
            <Toaster position="top-center" richColors theme="system" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
