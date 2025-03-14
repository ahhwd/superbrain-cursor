'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 記錄錯誤到錯誤報告服務
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">發生嚴重錯誤</h2>
          <p className="mb-6">抱歉，應用程序發生了嚴重問題。</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={
              // 嘗試恢復，重新渲染組件
              () => reset()
            }
          >
            重試
          </button>
        </div>
      </body>
    </html>
  );
} 