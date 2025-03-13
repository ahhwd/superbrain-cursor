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

interface SourceUrl {
  url: string;
  title: string;
  createdAt: string;
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
  const [sourceUrls, setSourceUrls] = useState<Record<string, SourceUrl[]>>({});
  const [loadingSourceUrls, setLoadingSourceUrls] = useState<Record<string, boolean>>({});
  const [showSourceUrls, setShowSourceUrls] = useState<Record<string, boolean>>({});

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

  const fetchSourceUrls = async (category: string) => {
    try {
      setLoadingSourceUrls(prev => ({ ...prev, [category]: true }));
      
      // 如果已經獲取過，直接顯示
      if (sourceUrls[category]) {
        setShowSourceUrls(prev => ({ ...prev, [category]: !prev[category] }));
        setLoadingSourceUrls(prev => ({ ...prev, [category]: false }));
        return;
      }
      
      const response = await fetch(`/api/highlights/source-url?category=${encodeURIComponent(category)}`);
      
      if (!response.ok) {
        throw new Error("獲取來源 URL 失敗");
      }
      
      const data = await response.json();
      setSourceUrls(prev => ({ ...prev, [category]: data.sourceUrls }));
      setShowSourceUrls(prev => ({ ...prev, [category]: true }));
    } catch (err) {
      console.error("獲取來源 URL 時發生錯誤:", err);
      alert("獲取來源 URL 時發生錯誤");
    } finally {
      setLoadingSourceUrls(prev => ({ ...prev, [category]: false }));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // 渲染分頁按鈕
  const renderPaginationButtons = () => {
    const { page, totalPages } = pagination;
    const buttons = [];
    
    // 上一頁按鈕
    buttons.push(
      <button 
        key="prev" 
        onClick={() => handlePageChange(page - 1)} 
        disabled={page === 1}
        className={`px-3 py-1 rounded-md ${page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
      >
        上一頁
      </button>
    );
    
    // 頁碼按鈕
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    
    if (startPage > 1) {
      buttons.push(
        <button 
          key="1" 
          onClick={() => handlePageChange(1)} 
          className="px-3 py-1 mx-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2">...</span>);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(i)} 
          className={`px-3 py-1 mx-1 rounded-md ${i === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        >
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2">...</span>);
      }
      buttons.push(
        <button 
          key={totalPages} 
          onClick={() => handlePageChange(totalPages)} 
          className="px-3 py-1 mx-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          {totalPages}
        </button>
      );
    }
    
    // 下一頁按鈕
    buttons.push(
      <button 
        key="next" 
        onClick={() => handlePageChange(page + 1)} 
        disabled={page === totalPages}
        className={`px-3 py-1 rounded-md ${page === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
      >
        下一頁
      </button>
    );
    
    return buttons;
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">精華筆記列表</h2>
            {pagination.total > 0 && (
              <p className="text-gray-500 text-xs sm:text-sm">
                共 {pagination.total} 筆記錄，第 {pagination.page} 頁，共 {pagination.totalPages} 頁
              </p>
            )}
          </div>
          
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
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  最後更新: {new Date(highlight.updatedAt).toLocaleString('zh-TW')}
                </div>
                <button 
                  onClick={() => fetchSourceUrls(highlight.category)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  title="查看原始網頁"
                >
                  {loadingSourceUrls[highlight.category] ? (
                    <span className="text-xs">載入中...</span>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      <span className="text-xs">原始網頁</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* 來源 URL 列表 */}
              {showSourceUrls[highlight.category] && sourceUrls[highlight.category] && (
                <div className="mt-3 border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">原始網頁來源:</h4>
                  {sourceUrls[highlight.category].length > 0 ? (
                    <ul className="text-xs space-y-1">
                      {sourceUrls[highlight.category].map((source, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-500 mr-2">{index + 1}.</span>
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline break-all"
                            title={source.title}
                          >
                            {source.title || source.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500">沒有找到原始網頁來源</p>
                  )}
                </div>
              )}
            </div>
            );
          })}
          
          {pagination.totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-6 sm:mt-8 gap-1 sm:gap-2">
              {renderPaginationButtons()}
            </div>
          )}
        </div>
      )}
    </main>
  );
} 