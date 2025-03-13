import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 頂部導航欄 */}
      <header className="fixed w-full bg-black z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-500">SuperBrain</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                登入
              </Link>
              <Link href="/auth/register" className="px-4 py-2 rounded-md border border-blue-600 text-blue-500 hover:bg-blue-900 transition-colors">
                註冊
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 英雄區塊 */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                將您的知識整理成<span className="text-blue-500">精華筆記</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                SuperBrain 使用 AI 自動將您擷取的網頁內容整理成不同主題的精華筆記，讓您輕鬆掌握重要知識。
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth/register" className="px-6 py-3 rounded-lg bg-blue-600 text-white text-center font-medium hover:bg-blue-700 transition-colors">
                  免費註冊
                </Link>
                <Link href="#features" className="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 text-center font-medium hover:bg-gray-800 transition-colors">
                  了解更多
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-80 sm:h-96 w-full rounded-lg shadow-xl overflow-hidden border border-gray-800">
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg m-4 overflow-hidden border border-gray-700">
                    <div className="bg-blue-900 px-4 py-2">
                      <h3 className="text-lg font-semibold text-white">經濟學精華筆記</h3>
                    </div>
                    <div className="p-4">
                      <div className="mb-3 pb-2 border-b border-gray-700">
                        <p className="text-sm text-gray-400 mb-1">2025年3月更新</p>
                      </div>
                      <p className="text-gray-300 mb-2 text-sm">關稅是政府對進口或出口商品徵收的稅款，其高低影響國際貿易、產業發展和物價。</p>
                      <p className="text-gray-300 mb-2 text-sm">主要影響包括：</p>
                      <ul className="list-disc pl-5 text-sm text-gray-300 mb-2">
                        <li>對國際貿易的影響</li>
                        <li>對產業發展的影響</li>
                        <li>對物價的影響</li>
                        <li>對國家財政收入的影響</li>
                      </ul>
                      <p className="text-gray-300 text-sm">2025年3月，美國對加拿大、墨西哥及中國進口商品徵收關稅，引發了廣泛討論...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能區塊 */}
      <section id="features" className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">SuperBrain 的強大功能</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              讓 AI 幫您整理知識，提高學習和工作效率
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 功能 1 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">網頁內容擷取</h3>
              <p className="text-gray-300">
                使用 Chrome 擴充功能，一鍵擷取您正在閱讀的網頁內容，自動保存到您的帳戶中。
              </p>
            </div>

            {/* 功能 2 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI 自動分類</h3>
              <p className="text-gray-300">
                AI 自動分析內容並分類，將相關主題的內容整合在一起，幫助您建立知識體系。
              </p>
            </div>

            {/* 功能 3 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700">
              <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">精華筆記生成</h3>
              <p className="text-gray-300">
                自動將擷取的內容整理成精華筆記，突出重點，幫助您快速掌握和記憶關鍵信息。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 行動召喚 */}
      <section className="py-20 bg-blue-900 text-white border-t border-blue-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">準備好提升您的知識管理了嗎？</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            立即註冊 SuperBrain，讓 AI 幫您整理知識，提高學習和工作效率。
          </p>
          <Link href="/auth/register" className="inline-block px-8 py-4 rounded-lg bg-white text-blue-900 font-bold text-lg hover:bg-gray-100 transition-colors">
            免費開始使用
          </Link>
        </div>
      </section>

      {/* 頁腳 */}
      <footer className="py-12 bg-gray-900 text-gray-400 border-t border-gray-800">
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
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} SuperBrain. 保留所有權利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 