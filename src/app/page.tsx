import Sidebar from "@/components/ui/sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <div>
     
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold mb-6">歡迎來到飲食紀錄系統</h1>
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={150}
          className="mb-6"
        />
        <p className="text-lg text-gray-700" ><a href="/dashboard">點我進入</a></p>
      </main>
    </div>
  );
}
