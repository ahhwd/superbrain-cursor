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
  summary: string | null;
  category: string | null;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });
  const [updatingContentId, setUpdatingContentId] = useState<string | null>(null);

  const fetchContents = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/content?page=${page}&limit=${pagination.limit}`, {
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
      setContents(data.contents);
      setPagination(data.pagination);
    } catch (err) {
      console.error('獲取內容時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchContents(pagination.page);
    }
  }, [session, router]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchContents(newPage);
    }
  };

  const handleUpdateSummary = async (contentId: string) => {
    try {
      setUpdatingContentId(contentId);
      const response = await fetch('/api/content/update-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '更新摘要失敗');
      }
      
      // 更新本地狀態
      setContents(prevContents => 
        prevContents.map(content => 
          content.id === contentId 
            ? { ...content, summary: data.summary, category: data.category } 
            : content
        )
      );
      
      alert('摘要和分類已更新');
    } catch (err) {
      console.error('更新摘要時發生錯誤:', err);
      alert(`更新摘要失敗: ${err instanceof Error ? err.message : '未知錯誤'}`);
    } finally {
      setUpdatingContentId(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 生成頁碼按鈕
  const renderPaginationButtons = () => {
    const buttons = [];
    const { page, totalPages } = pagination;
    
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* 側邊欄 */}
        <Sidebar className="w-64 min-h-screen sticky top-0" />
        
        {/* 主要內容區域 */}
        <div className="flex-1 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold mb-4">已擷取筆記</h1>
              <p className="text-gray-600 mb-4">
                在這裡您可以查看所有已經擷取的網頁內容和筆記。
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-700">
                  <strong>注意：</strong> 要使用 AI 生成摘要和分類功能，請在 <code>.env</code> 文件中設置您的 OpenAI API 密鑰。
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">已擷取筆記</h2>
                {pagination.total > 0 && (
                  <p className="text-gray-500 text-sm">
                    共 {pagination.total} 筆記錄，第 {pagination.page} 頁，共 {pagination.totalPages} 頁
                  </p>
                )}
              </div>
              
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
                <>
                  <div className="space-y-6">
                    {contents.map((content) => {
                      console.log('渲染內容:', content.id, '摘要:', content.summary, '分類:', content.category);
                      return (
                      <div key={content.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium mb-2">
                            <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {content.title}
                            </a>
                          </h3>
                          <button
                            onClick={() => handleUpdateSummary(content.id)}
                            disabled={updatingContentId === content.id}
                            className={`px-3 py-1 text-xs rounded-md ${
                              updatingContentId === content.id
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            {updatingContentId === content.id ? '更新中...' : '更新摘要'}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {content.category && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {content.category}
                            </span>
                          )}
                          <span className="text-gray-600 text-sm">
                            {new Date(content.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {content.summary ? (
                          <>
                            <p className="text-gray-700 mb-2 font-medium">摘要：</p>
                            <p className="text-gray-700 mb-4">{content.summary}</p>
                          </>
                        ) : (
                          <p className="text-gray-500 italic mb-4">尚未生成摘要</p>
                        )}
                        
                        <p className="text-gray-700 mb-2 font-medium">擷取筆記：</p>
                        <p className="text-gray-700 line-clamp-3">{content.content}</p>
                        
                        {/* 調試信息 */}
                        <details className="mt-4 text-xs text-gray-500">
                          <summary>調試信息</summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                            {JSON.stringify({id: content.id, summary: content.summary, category: content.category}, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )})}
                  </div>
                  
                  {/* 分頁控制 */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                      {renderPaginationButtons()}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 