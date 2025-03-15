'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 為 Chrome API 添加類型聲明
declare global {
  interface Window {
    chrome?: {
      runtime: {
        sendMessage: (extensionId: string, message: any) => void;
      };
    };
  }
}

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // 在組件加載時添加調試信息
  useEffect(() => {
    setDebugInfo(`頁面加載時間: ${new Date().toISOString()}\n環境: ${process.env.NODE_ENV}`);
    
    // 檢查是否有 CSRF token cookie
    const cookies = document.cookie.split(';').map(c => c.trim());
    const csrfCookie = cookies.find(c => c.startsWith('next-auth.csrf-token='));
    setDebugInfo(prev => `${prev}\nCSRF Cookie: ${csrfCookie ? '存在' : '不存在'}`);
    
    // 顯示當前 URL
    setDebugInfo(prev => `${prev}\n當前 URL: ${window.location.href}`);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('嘗試登入:', { email });
    setDebugInfo(prev => `${prev}\n嘗試登入: ${email} 時間: ${new Date().toISOString()}`);

    try {
      // 使用 signIn 函數，強制設置 callbackUrl 為本地 URL
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: 'http://localhost:3000/dashboard',
      });

      console.log('signIn 函數登入結果:', result);
      setDebugInfo(prev => `${prev}\nsignIn 函數登入結果: ${JSON.stringify(result)}`);

      if (result?.error) {
        setError(`登入失敗：${result.error}`);
        return;
      }

      if (!result?.ok) {
        setError('登入失敗，請稍後再試');
        return;
      }

      // 檢查是否是從 Chrome Extension 來的登入
      const urlParams = new URLSearchParams(window.location.search);
      const extensionId = urlParams.get('extensionId');

      if (extensionId && window.chrome?.runtime) {
        // 向 Chrome Extension 發送登入成功訊息
        window.chrome.runtime.sendMessage(extensionId, {
          type: 'LOGIN_SUCCESS',
          token: result?.ok ? 'dummy-token' : null, // 這裡應該使用實際的 token
          user: {
            email,
            name: email.split('@')[0], // 暫時使用 email 的前半部分作為名稱
          }
        });
      } else {
        // 一般登入，重定向到儀表板
        console.log('登入成功，重定向到儀表板');
        setDebugInfo(prev => `${prev}\n登入成功，重定向到儀表板 時間: ${new Date().toISOString()}`);
        
        // 使用 window.location 進行重定向，而不是 router.push
        window.location.href = 'http://localhost:3000/dashboard';
      }
    } catch (error) {
      console.error('登入錯誤:', error);
      setError('登入時發生錯誤，請稍後再試');
      setDebugInfo(prev => `${prev}\n登入錯誤: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold mb-8 text-center">登入</h1>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                  </div>
                )}
                {debugInfo && (
                  <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 whitespace-pre-wrap text-xs">
                    <h3 className="font-bold">調試信息:</h3>
                    {debugInfo}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      電子郵件
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      defaultValue="test1@gmail.com"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      密碼
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      defaultValue="password123"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                      {isLoading ? '登入中...' : '登入'}
                    </button>
                  </div>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    還沒有帳號？{' '}
                    <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                      立即註冊
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 