"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useTranslation } from "@/lib/useTranslation";

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
  const { t } = useTranslation();
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
        throw new Error(t('highlights_error'));
      }
      
      const data = await response.json();
      console.log("獲取到的精華筆記資料:", data.highlights);
      setHighlights(data.highlights);
      setPagination(data.pagination);
    } catch (err) {
      console.error("獲取精華筆記時發生錯誤:", err);
      setError(t('highlights_error'));
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
        throw new Error(t('highlights_error'));
      }
      
      const data = await response.json();
      setSourceUrls(prev => ({ ...prev, [category]: data.sourceUrls }));
      setShowSourceUrls(prev => ({ ...prev, [category]: true }));
    } catch (err) {
      console.error("獲取來源 URL 時發生錯誤:", err);
      alert(t('highlights_error'));
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
        {t('pagination_prev')}
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
        {t('pagination_next')}
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
            <p>{t('loading')}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">{t('highlights_title')}</h1>
      <p className="text-gray-600 mb-6">{t('highlights_description')}</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-900">{t('highlights_loading')}</p>
        </div>
      ) : highlights.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">{t('highlights_empty')}</p>
          <p className="text-gray-500 mt-2 text-sm">
            {t('highlights_empty_description')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">{t('highlights_list_title')}</h2>
            {pagination.total > 0 && (
              <p className="text-gray-500 text-xs sm:text-sm">
                {t('pagination_page_info').replace('{total}', pagination.total.toString())
                                         .replace('{page}', pagination.page.toString())
                                         .replace('{totalPages}', pagination.totalPages.toString())}
              </p>
            )}
          </div>
          
          {/* 精華筆記列表 */}
          <div className="space-y-6">
            {highlights.map((highlight) => (
              <div key={highlight.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: getCategoryColor(highlight.category) }}
                  >
                    {highlight.category}
                  </span>
                </div>
                
                {highlight.title && (
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{highlight.title}</h3>
                )}
                
                <div className="prose max-w-none text-gray-700">
                  {highlight.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() ? (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ) : null
                  ))}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => fetchSourceUrls(highlight.category)}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  >
                    {loadingSourceUrls[highlight.category] ? (
                      <span className="mr-2">{t('loading')}</span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                        </svg>
                        {t('highlights_source_urls')}
                      </>
                    )}
                  </button>
                  <span className="text-gray-500 text-sm">
                    {new Date(highlight.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* 來源 URL 列表 */}
                {showSourceUrls[highlight.category] && sourceUrls[highlight.category] && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{t('highlights_source_urls')}:</h4>
                    <ul className="space-y-2">
                      {sourceUrls[highlight.category].map((source, index) => (
                        <li key={index} className="text-sm">
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {source.title || source.url}
                          </a>
                          <span className="text-gray-500 ml-2 text-xs">
                            {new Date(source.createdAt).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* 分頁控制 */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-8 gap-2">
              {renderPaginationButtons()}
            </div>
          )}
        </div>
      )}
    </main>
  );
} 