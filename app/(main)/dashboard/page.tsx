import Header from "@/components/ui/Header"

const page = () => {
  return (
    <div className="min-h-screen  font-sans p-8 flex flex-col gap-8">
      {/* Top Navigation Area */}
      <div className="flex justify-between items-center border-b-4 border-black pb-4">
       
        <div className="bg-yellow-500 px-6 py-2 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
      
        </div>
      </div>

      {/* Main Bauhaus Grid Layout */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(100px,auto)]">
        
        {/* Large Hero Block - Red */}
        <div className="md:col-span-8 bg-red-600 p-8 border-4 border-black flex flex-col justify-center items-start shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-white font-medium max-w-md">
            Form follows function. Analyze your metrics in a structured environment.
          </p>
        </div>

        {/* Circle Decorative Block - Blue */}
        <div className="md:col-span-4 bg-blue-600 border-4 border-black flex items-center justify-center relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
           <div className="w-48 h-48 bg-white rounded-full border-4 border-black absolute -right-12 -bottom-12"></div>
           <span className="text-white font-bold text-2xl relative z-10">Metrics</span>
        </div>

        {/* Tall Vertical Block - Yellow */}
        <div className="md:col-span-3 md:row-span-2 bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div className="w-12 h-12 bg-black rounded-full"></div>
          <div className="space-y-4">
            <div className="h-4 bg-black w-full"></div>
            <div className="h-4 bg-black w-2/3"></div>
            <div className="h-4 bg-black w-1/2"></div>
          </div>
        </div>

        {/* Content Area - White */}
        <div className="md:col-span-9 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-bold mb-6 border-l-8 border-blue-600 pl-4">Recent Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="border-2 border-black p-4 hover:bg-zinc-100 transition-colors">
                 <div className="text-sm text-zinc-500 mb-2">Module 0{i}</div>
                 <div className="font-bold text-lg">Data Point</div>
               </div>
             ))}
          </div>
        </div>

        {/* Bottom Strip - Black */}
        <div className="md:col-span-9 bg-black text-white p-6 flex items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
           <span className="font-mono">SYSTEM_STATUS: ONLINE</span>
           <div className="flex gap-2">
             <div className="w-4 h-4 bg-red-600 rounded-full"></div>
             <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
             <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
           </div>
        </div>

      </main>
    </div>
  )
}
export default page