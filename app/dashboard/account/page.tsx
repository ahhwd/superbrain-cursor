"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

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
        </div>
      </div>
    </div>
  );
} 