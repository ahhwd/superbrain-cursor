"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { prisma } from "@/lib/prisma";

export default function AccountPage() {
  const { data: session } = useSession();
  const [monthlyCaptures, setMonthlyCaptures] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUsageData() {
      if (session?.user?.email) {
        try {
          setLoading(true);
          const response = await fetch('/api/account/usage');
          if (response.ok) {
            const data = await response.json();
            setMonthlyCaptures(data.monthlyCaptures);
          }
        } catch (error) {
          console.error("獲取使用量數據時出錯:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUsageData();
  }, [session]);

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-900">帳號與設定</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          管理您的帳號設定和個人資料。
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">個人資料</h2>
        
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

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">使用量</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">本月擷取網頁數量</p>
            {loading ? (
              <p className="text-sm sm:text-base">載入中...</p>
            ) : (
              <p className="text-sm sm:text-base font-semibold">{monthlyCaptures} 頁</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">帳號</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled
            >
              升級到 Pro 版本
            </button>
            <span className="ml-3 text-sm text-gray-500 italic">(即將推出)</span>
          </div>
        </div>
      </div>
    </div>
  );
} 