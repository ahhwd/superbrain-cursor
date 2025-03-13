'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 頂部導航欄 */}
      <header className="fixed w-full bg-white z-50 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">{t('app_name')}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                {t('nav_login')}
              </Link>
              <Link href="/auth/register" className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors">
                {t('nav_register')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 簡化的英雄區塊 */}
      <section className="pt-32 pb-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-blue-600">{t('hero_title')}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('hero_description')}
            </p>
            
            {/* 示意圖 - 使用內聯 SVG */}
            <div className="max-w-md mx-auto mb-0 p-2">
              <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" className="w-full">
                {/* 中央大腦圖示 */}
                <circle cx="200" cy="110" r="40" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                <path d="M200 90 L200 130 M185 105 L215 115 M185 115 L215 105" stroke="#3b82f6" strokeWidth="2" />
                
                {/* 連接線和節點 */}
                <circle cx="100" cy="70" r="6" fill="#3b82f6" />
                <line x1="110" y1="75" x2="175" y2="95" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                
                <circle cx="300" cy="70" r="6" fill="#3b82f6" />
                <line x1="290" y1="75" x2="225" y2="95" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                
                <circle cx="100" cy="150" r="6" fill="#3b82f6" />
                <line x1="110" y1="145" x2="175" y2="125" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                
                <circle cx="300" cy="150" r="6" fill="#3b82f6" />
                <line x1="290" y1="145" x2="225" y2="125" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                
                {/* 文本框 */}
                <rect x="60" y="50" width="80" height="40" rx="4" fill="white" stroke="#3b82f6" strokeWidth="1" />
                <line x1="70" y1="65" x2="130" y2="65" stroke="#3b82f6" strokeWidth="1" />
                <line x1="70" y1="75" x2="120" y2="75" stroke="#3b82f6" strokeWidth="1" />
                
                <rect x="260" y="50" width="80" height="40" rx="4" fill="white" stroke="#3b82f6" strokeWidth="1" />
                <line x1="270" y1="65" x2="330" y2="65" stroke="#3b82f6" strokeWidth="1" />
                <line x1="270" y1="75" x2="320" y2="75" stroke="#3b82f6" strokeWidth="1" />
                
                <rect x="60" y="130" width="80" height="40" rx="4" fill="white" stroke="#3b82f6" strokeWidth="1" />
                <line x1="70" y1="145" x2="130" y2="145" stroke="#3b82f6" strokeWidth="1" />
                <line x1="70" y1="155" x2="120" y2="155" stroke="#3b82f6" strokeWidth="1" />
                
                <rect x="260" y="130" width="80" height="40" rx="4" fill="white" stroke="#3b82f6" strokeWidth="1" />
                <line x1="270" y1="145" x2="330" y2="145" stroke="#3b82f6" strokeWidth="1" />
                <line x1="270" y1="155" x2="320" y2="155" stroke="#3b82f6" strokeWidth="1" />
                
                {/* 標題 */}
                <text x="200" y="30" textAnchor="middle" fill="#3b82f6" fontWeight="bold" fontSize="14">{t('diagram_title')}</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 功能區塊 */}
      <section id="features" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t('features_title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('features_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 功能 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('feature1_title')}</h3>
              <p className="text-gray-600">
                {t('feature1_description')}
              </p>
            </div>

            {/* 功能 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('feature2_title')}</h3>
              <p className="text-gray-600">
                {t('feature2_description')}
              </p>
            </div>

            {/* 功能 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('feature3_title')}</h3>
              <p className="text-gray-600">
                {t('feature3_description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 行動召喚 */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('cta_title')}</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            {t('cta_description')}
          </p>
          <Link href="/auth/register" className="inline-block px-8 py-4 rounded-lg bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-colors">
            {t('cta_button')}
          </Link>
        </div>
      </section>

      {/* 頁腳 */}
      <footer className="py-8 bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-white">{t('app_name')}</span>
              <p className="mt-2">{t('footer_description')}</p>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex space-x-6">
                <Link href="/auth/signin" className="hover:text-white transition-colors">
                  {t('nav_login')}
                </Link>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  {t('nav_register')}
                </Link>
                <a href="#features" className="hover:text-white transition-colors">
                  {t('nav_features')}
                </a>
              </div>
              <LanguageSwitcher className="mt-4 md:mt-0" />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} SuperBrain. {t('footer_copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 