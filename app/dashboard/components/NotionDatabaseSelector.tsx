"use client";

import { useState, useEffect } from 'react';

interface Database {
  id: string;
  title: string;
  url: string;
  created_time: string;
  last_edited_time: string;
}

interface NotionDatabaseSelectorProps {
  notionIntegrationId: string;
  onDatabaseSelected: (databaseId: string, databaseName: string) => void;
}

export default function NotionDatabaseSelector({ notionIntegrationId, onDatabaseSelected }: NotionDatabaseSelectorProps) {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string>('');

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/notion/databases', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '獲取 Notion 數據庫列表失敗');
        }
        
        const data = await response.json();
        setDatabases(data);
      } catch (err) {
        console.error('獲取 Notion 數據庫列表時發生錯誤:', err);
        setError(err instanceof Error ? err.message : '獲取 Notion 數據庫列表時發生錯誤');
      } finally {
        setIsLoading(false);
      }
    };

    if (notionIntegrationId) {
      fetchDatabases();
    }
  }, [notionIntegrationId]);

  const handleDatabaseSelect = async () => {
    if (!selectedDatabaseId) {
      setError('請選擇一個數據庫');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const selectedDatabase = databases.find(db => db.id === selectedDatabaseId);
      if (!selectedDatabase) {
        throw new Error('找不到選擇的數據庫');
      }
      
      const response = await fetch('/api/notion/databases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          databaseId: selectedDatabaseId,
          databaseName: selectedDatabase.title
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '選擇 Notion 數據庫失敗');
      }
      
      const data = await response.json();
      onDatabaseSelected(data.databaseId, data.databaseName);
    } catch (err) {
      console.error('選擇 Notion 數據庫時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '選擇 Notion 數據庫時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && databases.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">選擇 Notion 數據庫</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error && databases.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">選擇 Notion 數據庫</h2>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (databases.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">選擇 Notion 數據庫</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">您的 Notion 帳戶中沒有可用的數據庫</p>
          <p className="text-sm text-gray-400 mt-2">
            請先在 Notion 中創建一個數據庫
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">選擇 Notion 數據庫</h2>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="database-select" className="block text-sm font-medium text-gray-700 mb-2">
          選擇要同步的數據庫
        </label>
        <select
          id="database-select"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedDatabaseId}
          onChange={(e) => setSelectedDatabaseId(e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- 請選擇數據庫 --</option>
          {databases.map((db) => (
            <option key={db.id} value={db.id}>
              {db.title}
            </option>
          ))}
        </select>
      </div>
      
      <button
        className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleDatabaseSelect}
        disabled={isLoading || !selectedDatabaseId}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span>處理中...</span>
          </div>
        ) : (
          <span>確認選擇</span>
        )}
      </button>
    </div>
  );
} 