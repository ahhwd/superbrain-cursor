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
              <p className="text-gray-700 mb-4">
                使用左側的導航欄訪問不同功能：
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-700">
                <li className="mb-2">在「擷取內容」頁面查看您已擷取的所有網頁內容</li>
                <li className="mb-2">在「精華筆記」頁面查看您標記為重要的內容</li>
                <li className="mb-2">在「帳號管理」頁面管理您的個人資料</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 