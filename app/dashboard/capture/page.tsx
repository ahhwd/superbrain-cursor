"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useTranslation } from "@/lib/useTranslation";

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
  const { t } = useTranslation();

  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

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
        throw new Error(t('error'));
      }
      
      const data = await response.json();
      setContents(data.contents);
      setPagination(data.pagination);
    } catch (err) {
      console.error('獲取內容時發生錯誤:', err);
      setError(err instanceof Error ? err.message : t('error'));
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

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{t('capture_title')}</h1>
        <p className="text-gray-600 text-sm sm:text-base mb-2 sm:mb-4">
          {t('capture_description')}
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">{t('capture_list_title')}</h2>
          {pagination.total > 0 && (
            <p className="text-gray-500 text-xs sm:text-sm">
              {t('pagination_page_info').replace('{total}', pagination.total.toString())
                                       .replace('{page}', pagination.page.toString())
                                       .replace('{totalPages}', pagination.totalPages.toString())}
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
            <p className="text-gray-500">{t('capture_empty')}</p>
            <p className="text-sm text-gray-400 mt-2">
              {t('capture_empty_description')}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 sm:space-y-6">
              {contents.map((content) => {
                return (
                <div key={content.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base sm:text-lg font-medium mb-2 break-words pr-2">
                      <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {content.title}
                      </a>
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {content.category && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {content.category}
                      </span>
                    )}
                    <span className="text-gray-600 text-xs sm:text-sm">
                      {new Date(content.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {content.summary ? (
                    <>
                      <p className="text-gray-700 mb-1 sm:mb-2 font-medium">{t('capture_summary')}</p>
                      <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">{content.summary}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 italic text-sm sm:text-base mb-3 sm:mb-4">{t('capture_no_summary')}</p>
                  )}
                  
                  <div className="mt-4 sm:mt-6">
                    <p className="text-gray-700 mb-1 sm:mb-2 font-medium">{t('capture_content_label')}</p>
                    <p className="text-gray-700 text-sm sm:text-base line-clamp-3">{content.content}</p>
                  </div>
                </div>
              )})}
            </div>
            
            {/* 分頁控制 */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap justify-center mt-6 sm:mt-8 gap-1 sm:gap-2">
                {renderPaginationButtons()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 