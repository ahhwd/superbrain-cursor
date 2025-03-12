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
  "旅遊與體驗式生活"
];

// 生成摘要和分類的函數
export async function generateSummaryAndCategory(content: string, title: string, url: string) {
  try {
    const prompt = `
請分析以下網頁內容，並提供：
1. 一個簡短的摘要（不超過 150 字）
2. 從以下類別中選擇最適合的一個分類：${CATEGORIES.join('、')}

網頁標題：${title}
網頁網址：${url}
網頁內容：
${content.substring(0, 4000)} // 限制內容長度以避免超出 token 限制
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一個專業的內容分析助手，負責提供準確的內容摘要和分類。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const result = response.choices[0].message.content || '';
    
    // 解析回應以提取摘要和分類
    const summaryMatch = result.match(/摘要[：:]\s*([\s\S]*?)(?=分類[：:]|$)/i);
    const categoryMatch = result.match(/分類[：:]\s*([\s\S]*?)(?=$)/i);
    
    const summary = summaryMatch ? summaryMatch[1].trim() : '';
    let category = categoryMatch ? categoryMatch[1].trim() : '';
    
    // 確保分類在預定義的列表中
    if (!CATEGORIES.includes(category)) {
      // 嘗試找到最接近的分類
      category = CATEGORIES.find(c => category.includes(c)) || '其他';
    }
    
    return {
      summary,
      category
    };
  } catch (error) {
    console.error('生成摘要和分類時出錯:', error);
    return {
      summary: '',
      category: ''
    };
  }
} 