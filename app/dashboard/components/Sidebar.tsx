'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTranslation } from '@/lib/useTranslation';
import { TranslationKey } from '@/lib/translations';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export default function Sidebar({ className = '', onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  
  const menuItems = [
    { key: 'sidebar_dashboard' as TranslationKey, href: '/dashboard', icon: 'home' },
    { key: 'sidebar_highlights' as TranslationKey, href: '/dashboard/highlights', icon: 'star' },
    { key: 'sidebar_capture' as TranslationKey, href: '/dashboard/capture', icon: 'capture' },
    { key: 'sidebar_account' as TranslationKey, href: '/dashboard/account', icon: 'user' },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className={`bg-white shadow-lg rounded-lg p-4 flex flex-col h-full ${className}`}>
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="mb-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-blue-600">{t('app_name')}</h2>
        </div>
        
        <div className="space-y-2 flex-grow">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon === 'home' && (
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                )}
                {item.icon === 'capture' && (
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                )}
                {item.icon === 'star' && (
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                )}
                {item.icon === 'user' && (
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                )}
                {t(item.key)}
              </Link>
            );
          })}
        </div>
        
        <div className="pt-6 mt-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            {t('sidebar_logout')}
          </button>
        </div>
      </div>
    </div>
  );
} 