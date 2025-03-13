import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white">
      {/* 頂部導航欄 */}
      <header className="fixed w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">SuperBrain</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                登入
              </Link>
              <Link href="/auth/register" className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                註冊
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 英雄區塊 */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                將您的知識整理成<span className="text-blue-600">精華筆記</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                SuperBrain 使用 AI 自動將您擷取的網頁內容整理成不同主題的精華筆記，讓您輕鬆掌握重要知識。
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth/register" className="px-6 py-3 rounded-lg bg-blue-600 text-white text-center font-medium hover:bg-blue-700 transition-colors">
                  免費註冊
                </Link>
                <Link href="#features" className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 text-center font-medium hover:bg-gray-50 transition-colors">
                  了解更多
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-80 sm:h-96 w-full rounded-lg shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
                  <div className="text-center p-6 bg-white rounded-lg shadow-lg m-4">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">精華筆記示例</h3>
                    <p className="text-gray-700">AI 自動整理的精華內容，讓您快速掌握重點</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能區塊 */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">SuperBrain 的強大功能</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              讓 AI 幫您整理知識，提高學習和工作效率
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 功能 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">網頁內容擷取</h3>
              <p className="text-gray-600">
                使用 Chrome 擴充功能，一鍵擷取您正在閱讀的網頁內容，自動保存到您的帳戶中。
              </p>
            </div>

            {/* 功能 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 自動分類</h3>
              <p className="text-gray-600">
                AI 自動分析內容並分類，將相關主題的內容整合在一起，幫助您建立知識體系。
              </p>
            </div>

            {/* 功能 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">精華筆記生成</h3>
              <p className="text-gray-600">
                自動將擷取的內容整理成精華筆記，突出重點，幫助您快速掌握和記憶關鍵信息。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 使用流程 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">如何使用 SuperBrain</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              三個簡單步驟，開始您的知識管理之旅
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 步驟 1 */}
            <div className="relative">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">註冊帳戶</h3>
                <p className="text-gray-600">
                  創建您的 SuperBrain 帳戶，並安裝 Chrome 擴充功能。
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* 步驟 2 */}
            <div className="relative">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">擷取內容</h3>
                <p className="text-gray-600">
                  瀏覽網頁時，點擊擴充功能按鈕擷取您感興趣的內容。
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* 步驟 3 */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">查看精華筆記</h3>
                <p className="text-gray-600">
                  在儀表板中查看 AI 自動生成的精華筆記，輕鬆掌握知識重點。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 行動召喚 */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">準備好提升您的知識管理了嗎？</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            立即註冊 SuperBrain，讓 AI 幫您整理知識，提高學習和工作效率。
          </p>
          <Link href="/auth/register" className="inline-block px-8 py-4 rounded-lg bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-colors">
            免費開始使用
          </Link>
        </div>
      </section>

      {/* 頁腳 */}
      <footer className="py-12 bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold text-white">SuperBrain</span>
              <p className="mt-2">您的個人知識管理助手</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/auth/signin" className="hover:text-white transition-colors">
                登入
              </Link>
              <Link href="/auth/register" className="hover:text-white transition-colors">
                註冊
              </Link>
              <a href="#features" className="hover:text-white transition-colors">
                功能
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} SuperBrain. 保留所有權利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 