"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MobileNavbar from "./components/MobileNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 移動端導航欄 */}
      <MobileNavbar />
      
      <div className="flex">
        {/* 桌面端側邊欄 - 在移動端隱藏 */}
        <Sidebar className="w-64 min-h-screen sticky top-0 hidden md:block" />
        
        {/* 主要內容區域 - 在移動端添加頂部間距 */}
        <div className="flex-1 py-6 px-4 md:pt-6 pt-20">
          {children}
        </div>
      </div>
    </div>
  );
} 