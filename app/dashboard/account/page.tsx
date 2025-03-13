"use client";

import { useSession } from "next-auth/react";

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 mx-2 sm:mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">帳號管理</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          管理您的帳號設定和個人資料。
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mx-2 sm:mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">個人資料</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">電子郵件</p>
            <p className="text-sm sm:text-base">{session?.user?.email}</p>
          </div>
          
          <div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">名稱</p>
            <p className="text-sm sm:text-base">{session?.user?.name || '未設定'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 