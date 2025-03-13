import { useContext } from 'react';
import { LanguageContext } from '@/app/providers';
import translations, { TranslationKey } from './translations';

export function useTranslation() {
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
  
  return { t, locale };
} 