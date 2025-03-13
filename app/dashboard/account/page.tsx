"use client";

import { useSession, signOut } from "next-auth/react";

export default function AccountPage() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">帳號管理</h1>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">個人資料</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-4">
              <p className="text-sm text-gray-500">名稱</p>
              <p className="font-medium text-gray-900">{session?.user?.name || "未設定"}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">電子郵件</p>
              <p className="font-medium text-gray-900">{session?.user?.email || "未設定"}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            登出
          </button>
        </div>
      </div>
    </div>
  );
} 