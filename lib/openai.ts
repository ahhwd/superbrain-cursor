import OpenAI from 'openai';

// 初始化 OpenAI 客戶端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 使用 OpenAI 生成內容摘要和分類
 * @param content 原始內容
 * @param title 內容標題
 * @param url 內容來源URL
 * @returns 摘要和分類
 */
export async function generateSummaryAndCategory(
  content: string,
  title?: string,
  url?: string
): Promise<{ summary: string; category: string }> {
  try {
    console.log('開始生成摘要和分類...');
    
    // 如果沒有API密鑰，返回空結果
    if (!process.env.OPENAI_API_KEY) {
      console.warn('未設置 OPENAI_API_KEY 環境變量');
      return { summary: '', category: '' };
    }
    
    // 準備提示詞
    const prompt = `
請根據以下內容生成一個簡潔的摘要（不超過200字）和一個最適合的分類類別。

標題: ${title || '無標題'}
URL: ${url || '無URL'}
內容:
${content.substring(0, 4000)}

請以JSON格式回應，包含兩個字段：summary（摘要）和category（分類）。
分類應該是以下類別之一：經濟、半導體、投資、金融、運動、AI、科技、健康、教育、藝術、政治、環境、心理學、歷史、職場、其他。
`;

    // 調用 OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '你是一個專業的內容分析助手，擅長生成摘要和分類。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    // 解析回應
    const responseText = response.choices[0]?.message?.content || '';
    console.log('API 回應:', responseText);
    
    try {
      // 嘗試解析 JSON
      const parsedResponse = JSON.parse(responseText);
      return {
        summary: parsedResponse.summary || '',
        category: parsedResponse.category || '其他',
      };
    } catch (parseError) {
      console.error('解析 API 回應時發生錯誤:', parseError);
      
      // 如果無法解析 JSON，嘗試從文本中提取摘要和分類
      const summaryMatch = responseText.match(/summary["\s:]+([^"]+)/i);
      const categoryMatch = responseText.match(/category["\s:]+([^"]+)/i);
      
      return {
        summary: summaryMatch?.[1]?.trim() || '',
        category: categoryMatch?.[1]?.trim() || '其他',
      };
    }
  } catch (error) {
    console.error('調用 OpenAI API 時發生錯誤:', error);
    return { summary: '', category: '其他' };
  }
}

/**
 * 將新內容融合到現有的精華筆記中
 * @param existingContent 現有的精華筆記內容
 * @param newContent 新的內容（摘要或原始內容）
 * @param category 分類
 * @returns 融合後的內容
 */
export async function mergeContentToHighlight(
  existingContent: string,
  newContent: string,
  category: string
): Promise<{ content: string }> {
  try {
    console.log('開始融合內容到精華筆記...');
    
    // 如果沒有API密鑰，直接拼接內容
    if (!process.env.OPENAI_API_KEY) {
      console.warn('未設置 OPENAI_API_KEY 環境變量，使用簡單拼接');
      return { 
        content: `${existingContent}\n\n${newContent}` 
      };
    }
    
    // 準備提示詞
    const prompt = `
請將以下新內容融合到現有的精華筆記中，保持內容的連貫性和邏輯性。
如果新內容與現有內容有重複，請去除重複部分並整合相關信息。
如果新內容提供了新的觀點或信息，請適當添加到相關段落中。
最終生成的內容應該是一篇連貫、有組織的精華筆記。

如果新內容中有發生某個事件，請標註事件發生的年份和月份。例如「2025年3月，某公司發布了 2024 年 Q4 的財報」。
請善用條列式，用編號1.2.3.4.5.6.7.8.9.10...來表示，方便閱讀。
生成內容時，兩段文字之間請斷行。
生成內容時，請注意要說明清楚資訊是指哪個國家，例如「央行」是哪一國的央行，「政府」是哪一個國家或哪一個城市的政府。

分類: ${category}

現有精華筆記內容:
${existingContent}

新內容:
${newContent}

請直接返回融合後的完整內容，不要添加任何額外的說明或格式。
`;

    // 調用 OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '你是一個專業的內容編輯助手，擅長整合和融合相關內容。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    // 獲取回應文本
    const mergedContent = response.choices[0]?.message?.content || '';
    
    if (!mergedContent) {
      console.warn('API 返回空內容，使用簡單拼接');
      return { 
        content: `${existingContent}\n\n${newContent}` 
      };
    }
    
    return { content: mergedContent };
  } catch (error) {
    console.error('融合內容時發生錯誤:', error);
    // 發生錯誤時，使用簡單拼接
    return { 
      content: `${existingContent}\n\n${newContent}` 
    };
  }
} 