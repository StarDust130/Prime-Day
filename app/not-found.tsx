import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4 text-center">
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="/not-found.png"
          alt="404 Not Found"
          fill
          className="object-contain"
        />
      </div>
      <h1 className="text-4xl font-black uppercase mb-2">Page Not Found</h1>
      <p className="text-gray-500 font-medium mb-8 max-w-xs mx-auto">
        Oops! It looks like you've wandered into uncharted territory.
      </p>
      <Link href="/dashboard">
        <button className="bg-[#38BDF8] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] transition-all active:translate-y-[0px] active:shadow-none">
          Go Home
        </button>
      </Link>
    </div>
  );
}
