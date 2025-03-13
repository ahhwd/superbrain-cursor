"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";

export default function DashboardPage() {
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
      <div className="flex">
        {/* 側邊欄 */}
        <Sidebar className="w-64 min-h-screen sticky top-0" />
        
        {/* 主要內容區域 */}
        <div className="flex-1 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">儀表板</h1>
                  <p className="text-gray-600">歡迎回來，{session?.user?.name || "使用者"}！</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">歡迎使用 SuperBrain</h2>
              <p className="text-gray-700 mb-4">
                SuperBrain 是您的個人知識管理助手，幫助您擷取、整理和連接知識。
              </p>
              <ul className="list-none space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-medium mr-2">精華筆記：</span>
                  <span>AI 針對您擷取的內容自動整理成多篇經抓筆記</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">擷取內容：</span>
                  <span>可查看您已擷取過的所有網頁內容和摘要</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 