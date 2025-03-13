// 定義翻譯類型
type TranslationKey = 
  | 'app_name' | 'loading' | 'error'
  | 'nav_login' | 'nav_register' | 'nav_features'
  | 'sidebar_dashboard' | 'sidebar_highlights' | 'sidebar_capture' | 'sidebar_account' | 'sidebar_logout'
  | 'hero_title' | 'hero_description' | 'diagram_title'
  | 'features_title' | 'features_subtitle'
  | 'feature1_title' | 'feature1_description'
  | 'feature2_title' | 'feature2_description'
  | 'feature3_title' | 'feature3_description'
  | 'cta_title' | 'cta_description' | 'cta_button'
  | 'footer_description' | 'footer_copyright'
  | 'account_title' | 'account_description'
  | 'profile_title' | 'profile_email' | 'profile_name' | 'profile_not_set'
  | 'usage_title' | 'usage_monthly_captures' | 'usage_pages'
  | 'account_section_title' | 'upgrade_pro' | 'coming_soon'
  | 'language_title' | 'language_select' | 'language_en' | 'language_zh'
  | 'error_loading_usage' | 'error_loading_usage_detail';

type TranslationSet = {
  [key in TranslationKey]: string;
};

type Translations = {
  [locale: string]: TranslationSet;
};

// 翻譯文件
const translations: Translations = {
  // 英文翻譯
  'en': {
    // 通用
    'app_name': 'SuperBrain',
    'loading': 'Loading...',
    'error': 'Error',
    
    // 導航
    'nav_login': 'Login',
    'nav_register': 'Register',
    'nav_features': 'Features',
    
    // 側邊欄
    'sidebar_dashboard': 'Dashboard',
    'sidebar_highlights': 'Highlights',
    'sidebar_capture': 'Captured Content',
    'sidebar_account': 'Account Settings',
    'sidebar_logout': 'Logout',
    
    // 首頁
    'hero_title': 'AI Transforms Information into Knowledge',
    'hero_description': 'SuperBrain AI automatically organizes your captured web content into topic-based highlights, helping you easily master important knowledge.',
    'diagram_title': 'Knowledge Organization Diagram',
    'features_title': 'SuperBrain\'s Powerful Features',
    'features_subtitle': 'Let AI organize your knowledge, improve learning and work efficiency',
    'feature1_title': 'Web Content Capture',
    'feature1_description': 'Use the Chrome extension to capture the web content you\'re reading with one click, automatically saving it to your account.',
    'feature2_title': 'AI Auto-Categorization',
    'feature2_description': 'AI automatically analyzes and categorizes content, integrating related topics together to help you build a knowledge system.',
    'feature3_title': 'Highlight Generation',
    'feature3_description': 'Automatically organize captured content into highlights, emphasizing key points to help you quickly grasp and remember important information.',
    'cta_title': 'Ready to enhance your knowledge management?',
    'cta_description': 'Sign up for SuperBrain now and let AI help you organize knowledge, improving learning and work efficiency.',
    'cta_button': 'Start Using for Free',
    'footer_description': 'Your Personal Knowledge Assistant',
    'footer_copyright': 'All rights reserved.',
    
    // 帳號設定頁面
    'account_title': 'Account & Settings',
    'account_description': 'Manage your account settings and personal profile.',
    'profile_title': 'Profile',
    'profile_email': 'Email',
    'profile_name': 'Name',
    'profile_not_set': 'Not set',
    'usage_title': 'Usage',
    'usage_monthly_captures': 'Web pages captured this month',
    'usage_pages': 'pages',
    'account_section_title': 'Account',
    'upgrade_pro': 'Upgrade to Pro',
    'coming_soon': '(Coming Soon)',
    'language_title': 'Language',
    'language_select': 'Select language',
    'language_en': 'English',
    'language_zh': 'Traditional Chinese',
    
    // 錯誤訊息
    'error_loading_usage': 'Unable to load usage data',
    'error_loading_usage_detail': 'Error loading usage data'
  },
  
  // 繁體中文翻譯
  'zh-TW': {
    // 通用
    'app_name': 'SuperBrain',
    'loading': '載入中...',
    'error': '錯誤',
    
    // 導航
    'nav_login': '登入',
    'nav_register': '註冊',
    'nav_features': '功能',
    
    // 側邊欄
    'sidebar_dashboard': '儀表板',
    'sidebar_highlights': '精華筆記',
    'sidebar_capture': '擷取內容',
    'sidebar_account': '帳號設定',
    'sidebar_logout': '登出',
    
    // 首頁
    'hero_title': 'AI 幫你把資訊變成知識',
    'hero_description': 'SuperBrain AI 自動將您擷取的網頁內容整理成不同主題的精華筆記，幫您輕鬆掌握重要知識。',
    'diagram_title': '知識整理示意圖',
    'features_title': 'SuperBrain 的強大功能',
    'features_subtitle': '讓 AI 幫您整理知識，提高學習和工作效率',
    'feature1_title': '網頁內容擷取',
    'feature1_description': '使用 Chrome 擴充功能，一鍵擷取您正在閱讀的網頁內容，自動保存到您的帳戶中。',
    'feature2_title': 'AI 自動分類',
    'feature2_description': 'AI 自動分析內容並分類，將相關主題的內容整合在一起，幫助您建立知識體系。',
    'feature3_title': '精華筆記生成',
    'feature3_description': '自動將擷取的內容整理成精華筆記，突出重點，幫助您快速掌握和記憶關鍵信息。',
    'cta_title': '準備好提升您的知識管理了嗎？',
    'cta_description': '立即註冊 SuperBrain，讓 AI 幫您整理知識，提高學習和工作效率。',
    'cta_button': '免費開始使用',
    'footer_description': '您的個人知識管理助手',
    'footer_copyright': '保留所有權利。',
    
    // 帳號設定頁面
    'account_title': '帳號與設定',
    'account_description': '管理您的帳號設定和個人資料。',
    'profile_title': '個人資料',
    'profile_email': '電子郵件',
    'profile_name': '名稱',
    'profile_not_set': '未設定',
    'usage_title': '使用量',
    'usage_monthly_captures': '本月擷取網頁數量',
    'usage_pages': '頁',
    'account_section_title': '帳號',
    'upgrade_pro': '升級到 Pro 版本',
    'coming_soon': '(即將推出)',
    'language_title': '語言',
    'language_select': '選擇語言',
    'language_en': '英文',
    'language_zh': '繁體中文',
    
    // 錯誤訊息
    'error_loading_usage': '無法獲取使用量數據',
    'error_loading_usage_detail': '獲取使用量數據時出錯'
  }
};

export default translations;
export type { TranslationKey }; 