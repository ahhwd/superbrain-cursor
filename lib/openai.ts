import OpenAI from 'openai';

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 可能的分類列表
export const CATEGORIES = [
  "經濟學",
  "金融",
  "股票投資",
  "飲食健康",
  "數位行銷",
  "職場發展",
  "創業機會",
  "個人理財",
  "房地產投資",
  "科技趨勢與創新",
  "時間管理與生產力提升",
  "心理健康與壓力管理",
  "人際關係與社交技巧",
  "領導力與團隊管理",
  "健身與運動",
  "親子教育與家庭關係",
  "旅遊與體驗式生活",
  "科技"
];

// 生成摘要和分類的函數
export async function generateSummaryAndCategory(content: string, title: string, url: string) {
  try {
    console.log('開始生成摘要和分類，內容長度:', content.length, '標題:', title);
    console.log('API 密鑰是否存在:', !!process.env.OPENAI_API_KEY);
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API 密鑰未設置');
      return { summary: '', category: '' };
    }
    
    const prompt = `
請分析以下網頁內容，並提供：
1. 一個簡短的摘要（不超過 150 字）
2. 從以下類別中選擇最適合的一個分類：${CATEGORIES.join('、')}

網頁標題：${title}
網頁網址：${url}
網頁內容：
${content.substring(0, 3000)}
`;

    console.log('使用的 API 密鑰前綴:', process.env.OPENAI_API_KEY.substring(0, 5) + '...');
    console.log('發送到 OpenAI 的提示詞長度:', prompt.length);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "你是一個專業的內容分析助手，負責提供準確的內容摘要和分類。請確保回應格式為：\n摘要：[摘要內容]\n分類：[分類名稱]"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      console.log('OpenAI API 響應狀態: 成功');
      console.log('OpenAI API 響應內容:', JSON.stringify(response.choices[0].message));
      
      const result = response.choices[0].message.content || '';
      console.log('原始回應:', result);
      
      // 解析回應以提取摘要和分類
      const summaryMatch = result.match(/摘要[：:]\s*([\s\S]*?)(?=分類[：:]|$)/i);
      const categoryMatch = result.match(/分類[：:]\s*([\s\S]*?)(?=$)/i);
      
      console.log('摘要匹配結果:', summaryMatch ? '成功' : '失敗');
      console.log('分類匹配結果:', categoryMatch ? '成功' : '失敗');
      
      const summary = summaryMatch ? summaryMatch[1].trim() : '無法生成摘要';
      let category = categoryMatch ? categoryMatch[1].trim() : '其他';
      
      console.log('解析結果，摘要:', summary);
      console.log('解析結果，分類:', category);
      
      // 確保分類在預定義的列表中
      if (!CATEGORIES.includes(category)) {
        // 嘗試找到最接近的分類
        const originalCategory = category;
        category = CATEGORIES.find(c => category.includes(c) || c.includes(category)) || '其他';
        console.log('分類不在預定義列表中，原始分類:', originalCategory, '修正後分類:', category);
      }
      
      return {
        summary,
        category
      };
    } catch (apiError) {
      console.error('OpenAI API 調用失敗:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('生成摘要和分類時出錯:', error);
    return {
      summary: '生成摘要時發生錯誤',
      category: '其他'
    };
  }
} 