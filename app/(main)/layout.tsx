import BottomNav from "@/components/ui/BottomNav";
import Header from "@/components/ui/Header";



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <div className="min-h-screen flex flex-col max-w-3xl mx-auto md:border-black font-sans">
        <Header />
        <main className="flex-1 ">{children}</main>
        <BottomNav />
      </div>
    );
}
