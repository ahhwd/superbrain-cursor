"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
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
            <span>AI 針對您擷取的內容自動整理成多篇精華筆記</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">擷取內容：</span>
            <span>可查看您已擷取過的所有網頁內容和摘要</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 