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
  | 'error_loading_usage' | 'error_loading_usage_detail'
  // 儀表板頁面
  | 'dashboard_welcome_title' | 'dashboard_welcome_description'
  | 'dashboard_highlights_card' | 'dashboard_highlights_description'
  | 'dashboard_capture_card' | 'dashboard_capture_description'
  // 精華筆記頁面
  | 'highlights_title' | 'highlights_description'
  | 'highlights_list_title' | 'highlights_empty'
  | 'highlights_empty_description' | 'highlights_source_urls'
  | 'highlights_loading' | 'highlights_error'
  | 'pagination_prev' | 'pagination_next' | 'pagination_page_info'
  // 擷取內容頁面
  | 'capture_title' | 'capture_description'
  | 'capture_list_title' | 'capture_empty'
  | 'capture_empty_description' | 'capture_summary'
  | 'capture_no_summary' | 'capture_content_label';

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
    'error_loading_usage_detail': 'Error loading usage data',
    
    // 儀表板頁面
    'dashboard_welcome_title': 'Welcome to SuperBrain',
    'dashboard_welcome_description': 'Your AI knowledge assistant, helping you transform information into knowledge.',
    'dashboard_highlights_card': 'Highlights',
    'dashboard_highlights_description': 'View AI-organized highlights from your content',
    'dashboard_capture_card': 'Captured Content',
    'dashboard_capture_description': 'View your captured web content',
    
    // 精華筆記頁面
    'highlights_title': 'Highlights',
    'highlights_description': 'AI automatically organizes your captured web content into topic-based highlights',
    'highlights_list_title': 'Highlights List',
    'highlights_empty': 'No highlights available',
    'highlights_empty_description': 'Highlights will be automatically generated after you capture web content',
    'highlights_source_urls': 'Source URLs',
    'highlights_loading': 'Loading highlights...',
    'highlights_error': 'Error loading highlights',
    'pagination_prev': 'Previous',
    'pagination_next': 'Next',
    'pagination_page_info': 'Total {total} records, Page {page} of {totalPages}',
    
    // 擷取內容頁面
    'capture_title': 'Captured Content',
    'capture_description': 'You can view all your captured web content and AI-generated summaries',
    'capture_list_title': 'Captured Content',
    'capture_empty': 'No content captured yet',
    'capture_empty_description': 'Use the Chrome extension to capture web content',
    'capture_summary': 'Summary:',
    'capture_no_summary': 'No summary generated yet',
    'capture_content_label': 'Captured Content:'
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
    'error_loading_usage_detail': '獲取使用量數據時出錯',
    
    // 儀表板頁面
    'dashboard_welcome_title': '歡迎使用 SuperBrain',
    'dashboard_welcome_description': '您的 AI 知識助手，幫助您將資訊整理變成知識。',
    'dashboard_highlights_card': '精華筆記',
    'dashboard_highlights_description': '查看 AI 為您整理的精華筆記',
    'dashboard_capture_card': '擷取內容',
    'dashboard_capture_description': '查看您已擷取的網頁內容',
    
    // 精華筆記頁面
    'highlights_title': '精華筆記',
    'highlights_description': 'AI 將您從網頁儲存的擷取內容自動整理成不同主題的精華筆記',
    'highlights_list_title': '精華筆記列表',
    'highlights_empty': '目前沒有精華筆記',
    'highlights_empty_description': '當您擷取網頁內容後，系統會自動為您生成精華筆記',
    'highlights_source_urls': '來源網址',
    'highlights_loading': '載入中...',
    'highlights_error': '獲取精華筆記失敗',
    'pagination_prev': '上一頁',
    'pagination_next': '下一頁',
    'pagination_page_info': '共 {total} 筆記錄，第 {page} 頁，共 {totalPages} 頁',
    
    // 擷取內容頁面
    'capture_title': '已擷取內容',
    'capture_description': '您可以查看所有已經擷取的網頁內容，以及 AI 產生的摘要',
    'capture_list_title': '已擷取內容',
    'capture_empty': '尚未擷取任何內容',
    'capture_empty_description': '使用 Chrome 擴充功能來擷取網頁內容',
    'capture_summary': '摘要：',
    'capture_no_summary': '尚未生成摘要',
    'capture_content_label': '擷取內容：'
  }
};

export default translations;
export type { TranslationKey }; 