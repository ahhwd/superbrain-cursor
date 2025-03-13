"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

interface Highlight {
  id: string;
  title: string | null;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function HighlightsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchHighlights();
    }
  }, [status, pagination.page]);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/highlights?page=${pagination.page}&limit=${pagination.limit}`);
      
      if (!response.ok) {
        throw new Error("獲取精華筆記失敗");
      }
      
      const data = await response.json();
      console.log("獲取到的精華筆記資料:", data.highlights);
      setHighlights(data.highlights);
      setPagination(data.pagination);
    } catch (err) {
      console.error("獲取精華筆記時發生錯誤:", err);
      setError("獲取精華筆記時發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // 根據分類獲取背景顏色
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      '經濟學': '#3b82f6', // 藍色
      '科技': '#10b981', // 綠色
      '健康': '#ef4444', // 紅色
      '教育': '#f59e0b', // 橙色
      '藝術': '#8b5cf6', // 紫色
      '政治': '#6b7280', // 灰色
      '環境': '#059669', // 深綠色
      '心理學': '#ec4899', // 粉色
      '歷史': '#b45309', // 棕色
      '其他': '#6b7280', // 灰色
    };
    
    return colorMap[category] || '#6b7280'; // 默認灰色
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <main className="p-8">
          <div className="flex justify-center items-center h-full">
            <p>載入中...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">精華筆記</h1>
      <p className="text-gray-600 mb-6">AI 將您從網頁儲存的擷取內容自動整理成不同主題的精華筆記</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-900">載入中...</p>
        </div>
      ) : highlights.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">目前沒有精華筆記</p>
          <p className="text-gray-500 mt-2 text-sm">
            當您擷取網頁內容後，系統會自動為您生成精華筆記
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {highlights.map((highlight) => {
            console.log("渲染精華筆記:", highlight);
            const categoryColor = getCategoryColor(highlight.category);
            
            return (
            <div key={highlight.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">
                  <div className="inline-flex items-center">
                    <div style={{
                      backgroundColor: categoryColor,
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      display: 'inline-block',
                      marginRight: '8px'
                    }}>
                      {highlight.category}
                    </div>
                    {highlight.title && <span>{highlight.title.replace(`${highlight.category} 精華筆記`, '精華筆記')}</span>}
                  </div>
                </h2>
              </div>
              <div className="prose max-w-none text-gray-800">
                {highlight.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                最後更新: {new Date(highlight.updatedAt).toLocaleString('zh-TW')}
              </div>
            </div>
            );
          })}
          
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 rounded border disabled:opacity-50 text-gray-900"
                >
                  上一頁
                </button>
                <span className="px-3 py-1 text-gray-900">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 rounded border disabled:opacity-50 text-gray-900"
                >
                  下一頁
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </main>
  );
} 