import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const MascotLoading = () => {
    return (
      <div className="mt-40 md:mt-0 md:h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 max-w-md w-full text-center">
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
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
                Loading...
              </h2>
             
            </div>
          </div>
        </div>
      </div>
    );
};

export default MascotLoading;