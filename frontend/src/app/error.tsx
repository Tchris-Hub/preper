"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Something went wrong!</h2>
          <p className="text-neutral-400 text-sm">
            We apologize for the inconvenience. Our team has been notified.
            <br />
            {error.message || "An unexpected error occurred."}
          </p>
        </div>
        <Button 
          onClick={reset}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
