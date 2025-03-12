'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('登入失敗：電子郵件或密碼錯誤');
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
        router.push('/dashboard');
      }
    } catch (error) {
      setError('登入時發生錯誤，請稍後再試');
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      登入
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