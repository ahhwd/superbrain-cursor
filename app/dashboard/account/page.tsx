"use client";

import { useSession } from "next-auth/react";

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-900">帳號管理</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          管理您的帳號設定和個人資料。
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">個人資料</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">電子郵件</p>
            <p className="text-sm sm:text-base text-gray-800">{session?.user?.email}</p>
          </div>
          
          <div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">名稱</p>
            <p className="text-sm sm:text-base text-gray-800">{session?.user?.name || '未設定'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 