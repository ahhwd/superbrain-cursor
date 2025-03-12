"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

interface Content {
  id: string;
  title: string;
  url: string;
  content: string;
  createdAt: string;
}

export default function CapturePage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/content', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.status === 401) {
          // 如果未授權，重新導向到登入頁面
          console.error('未授權，重新導向到登入頁面');
          router.push('/auth/signin');
          return;
        }
        
        if (!response.ok) {
          throw new Error('無法載入內容');
        }
        
        const data = await response.json();
        setContents(data);
      } catch (err) {
        console.error('獲取內容時發生錯誤:', err);
        setError(err instanceof Error ? err.message : '發生錯誤');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchContents();
    }
  }, [session, router]);

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
              <h1 className="text-2xl font-bold mb-4">擷取筆記</h1>
              <p className="text-gray-600 mb-4">
                在這裡您可以查看所有已經擷取的網頁內容和筆記。
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">已擷取筆記</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-red-800">{error}</p>
                </div>
              ) : contents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">尚未擷取任何內容</p>
                  <p className="text-sm text-gray-400 mt-2">
                    使用 Chrome 擴充功能來擷取網頁內容
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {contents.map((content) => (
                    <div key={content.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-medium mb-2">
                        <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {content.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {new Date(content.createdAt).toLocaleString()}
                      </p>
                      <p className="text-gray-700 line-clamp-3">{content.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 