"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Content {
  id: string;
  title: string;
  url: string;
  content: string;
  createdAt: string;
}

export default function DashboardPage() {
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
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">儀表板</h1>
              <p className="text-gray-600">歡迎回來，{session?.user?.name || "使用者"}！</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              登出
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">擷取的內容</h2>
          
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
  );
} 