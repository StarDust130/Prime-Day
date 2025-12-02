import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 max-w-md w-full text-center">
        <div className="relative w-64 h-64 animate-pulse">
          <Image
            src="/anime-girl-5.png"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
              Loading...
            </h2>
            <p className="text-neutral-600 text-lg font-medium">
              &quot;The only way to do great work is to love what you do.&quot;
              - Steve Jobs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
