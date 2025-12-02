import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4 max-w-sm w-full text-center">
        <div className="bg-[#FFDE59] p-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
        <div>
          <h2 className="text-xl font-black mb-1">Loading...</h2>
          <p className="text-gray-500 font-medium text-sm">
            Getting everything ready for you
          </p>
        </div>
      </div>
    </div>
  );
}
