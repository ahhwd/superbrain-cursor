"use client";

import { SessionProvider } from "next-auth/react";
import { useState, useEffect, createContext } from 'react';

// 創建語言上下文
export const LanguageContext = createContext({
  locale: 'en',
  setLocale: (locale: string) => {}
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('en');
  
  // 從 localStorage 讀取語言設置
  useEffect(() => {
    const savedLocale = localStorage.getItem('superbrain-locale');
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  // 保存語言設置到 localStorage
  useEffect(() => {
    localStorage.setItem('superbrain-locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <SessionProvider>
      <LanguageContext.Provider value={{ locale, setLocale }}>
        {children}
      </LanguageContext.Provider>
    </SessionProvider>
  );
}