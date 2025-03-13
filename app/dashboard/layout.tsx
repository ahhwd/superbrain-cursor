"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  if (status === "loading") {
    return <div>載入中...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 桌面版側邊欄 */}
      <div className="w-64 hidden md:block">
        <Sidebar className="h-screen sticky top-0" />
      </div>

      {/* 移動版側邊欄 - 條件渲染 */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleSidebar}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <Sidebar className="h-screen" />
          </div>
        </div>
      )}

      <div className="flex-1">
        {/* 移動版頂部導航欄 */}
        <div className="md:hidden bg-white p-4 shadow-sm flex items-center">
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <span className="ml-4 text-xl font-bold text-blue-600">SuperBrain</span>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 