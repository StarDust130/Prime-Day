import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4 max-w-sm w-full text-center relative overflow-hidden">
        <div className="relative w-32 h-32 mb-2">
          <Image
            src="/anime-girl-5.png"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="bg-[#FFDE59] p-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
        <div className="z-10">
          <h2 className="text-xl font-black mb-1">Loading...</h2>
          <p className="text-gray-500 font-medium text-sm">
            Getting everything ready for you
          </p>
        </div>
      </div>
    </div>
  );
}
