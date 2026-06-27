import Navbar from "@/components/layout/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}
