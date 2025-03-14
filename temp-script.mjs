import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getArticleContent() {
  try {
    // 查詢標題包含 "Tesla drops FSD price to $99" 的文章
    const article = await prisma.content.findFirst({
      where: {
        title: {
          contains: "Tesla drops FSD price to $99"
        }
      }
    });

    if (article) {
      console.log('文章標題:', article.title);
      console.log('文章 URL:', article.url);
      console.log('文章內容:', article.content);
      console.log('創建時間:', article.createdAt);
    } else {
      console.log('找不到相關文章');
    }
  } catch (error) {
    console.error('查詢出錯:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getArticleContent(); 