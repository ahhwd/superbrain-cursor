'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/app/providers';
import { useTranslation } from '@/lib/useTranslation';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useContext(LanguageContext);
  const { t } = useTranslation();
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value);
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor="language-select" className="mr-2 text-sm text-gray-600">
        {t('language_select')}:
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={handleLanguageChange}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="en">{t('language_en')}</option>
        <option value="zh-TW">{t('language_zh')}</option>
      </select>
    </div>
  );
} 