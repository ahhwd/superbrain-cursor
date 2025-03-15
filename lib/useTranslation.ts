import { useContext } from 'react';
import { LanguageContext } from '@/app/providers';
import translations, { TranslationKey } from './translations';

// 定義 useTranslation 返回類型
interface UseTranslationReturn {
  t: (key: TranslationKey) => string;
  locale: string;
  translateCategory: (category: string | null) => string;
}

export function useTranslation(): UseTranslationReturn {
  const { locale } = useContext(LanguageContext);
  
  // 獲取翻譯文本
  const t = (key: TranslationKey): string => {
    // 檢查指定語言的翻譯是否存在
    if (translations[locale] && translations[locale][key]) {
      return translations[locale][key];
    }
    
    // 如果沒有找到翻譯，使用英文作為後備
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    
    // 如果連英文翻譯都沒有，返回鍵名
    return key;
  };
  
  // 翻譯分類
  const translateCategory = (category: string | null): string => {
    if (!category) return '';
    
    const key = `category_${category}` as TranslationKey;
    
    // 檢查是否有對應的翻譯
    if (translations[locale] && translations[locale][key]) {
      return translations[locale][key];
    }
    
    // 如果沒有找到翻譯，返回原始分類名
    return category;
  };
  
  return { t, locale, translateCategory };
} 