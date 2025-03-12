"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function HighlightsPage() {
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
              <h1 className="text-2xl font-bold mb-4">精華筆記</h1>
              <p className="text-gray-600">
                此頁面將顯示您標記為精華的筆記內容。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 