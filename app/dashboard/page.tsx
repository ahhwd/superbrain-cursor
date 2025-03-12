"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotionDatabaseSelector from "./components/NotionDatabaseSelector";
import Sidebar from "./components/Sidebar";

interface NotionIntegration {
  id: string;
  workspaceId: string;
  databaseId: string | null;
  notionDatabaseName: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  const [notionIntegration, setNotionIntegration] = useState<NotionIntegration | null>(null);
  const [showDatabaseSelector, setShowDatabaseSelector] = useState(false);

  useEffect(() => {
    if (session) {
      fetchNotionIntegration();
    }
  }, [session]);

  const fetchNotionIntegration = async () => {
    try {
      const response = await fetch('/api/notion/integration', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotionIntegration(data);
        
        // 如果已連接 Notion 但尚未選擇數據庫，顯示數據庫選擇器
        if (data && !data.databaseId) {
          setShowDatabaseSelector(true);
        } else {
          setShowDatabaseSelector(false);
        }
      }
    } catch (err) {
      console.error('獲取 Notion 整合資訊時發生錯誤:', err);
    }
  };

  const handleDatabaseSelected = (databaseId: string, databaseName: string) => {
    setNotionIntegration(prev => {
      if (!prev) return null;
      return {
        ...prev,
        databaseId,
        notionDatabaseName: databaseName
      };
    });
    setShowDatabaseSelector(false);
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
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">儀表板</h1>
                  <p className="text-gray-600">歡迎回來，{session?.user?.name || "使用者"}！</p>
                </div>
                <div className="flex space-x-4">
                  {notionIntegration && notionIntegration.databaseId && (
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded">
                      已選擇數據庫: {notionIntegration.notionDatabaseName || '未命名數據庫'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showDatabaseSelector && notionIntegration && (
              <NotionDatabaseSelector 
                notionIntegrationId={notionIntegration.id} 
                onDatabaseSelected={handleDatabaseSelected} 
              />
            )}

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">歡迎使用 SuperBrain</h2>
              <p className="text-gray-700 mb-4">
                SuperBrain 是您的個人知識管理助手，幫助您擷取、整理和連接知識。
              </p>
              <p className="text-gray-700 mb-4">
                使用左側的導航欄訪問不同功能：
              </p>
              <ul className="list-disc pl-5 mb-4 text-gray-700">
                <li className="mb-2">在「擷取筆記」頁面查看您已擷取的所有網頁內容</li>
                <li className="mb-2">在「精華筆記」頁面查看您標記為重要的內容</li>
                <li className="mb-2">在「帳號管理」頁面管理您的個人資料</li>
              </ul>
              <p className="text-gray-700">
                您也可以連接 Notion，將您的筆記同步到 Notion 數據庫中。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 