"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 text-center">
      <div className="relative w-64 h-64 mb-8">
        <Image src="/error.png" alt="Error" fill className="object-contain" />
      </div>
      <h1 className="text-4xl font-black uppercase mb-2 text-red-500">
        Something went wrong!
      </h1>
      <p className="text-gray-500 font-medium mb-8 max-w-xs mx-auto">
        Don't worry, even the best of us stumble sometimes. Let's try that
        again.
      </p>
      <Button
        onClick={() => reset()}
        className="bg-[#38BDF8] text-black px-8 py-6 rounded-xl font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] transition-all active:translate-y-[0px] active:shadow-none"
      >
        Try Again
      </Button>
    </div>
  );
}
