document.addEventListener('DOMContentLoaded', async () => {
  const statusContainer = document.getElementById('status');
  const actionContainer = document.getElementById('action-container');
  const loginButton = document.getElementById('login-button');
  const extractFullButton = document.getElementById('extract-full');

  // 檢查伺服器狀態和端口
  async function checkServer() {
    const ports = [3000, 3001, 3002, 3003];
    for (const port of ports) {
      try {
        const response = await fetch(`http://localhost:${port}/api/health`);
        if (response.ok) {
          console.log('伺服器運行在端口:', port);
          return port;
        }
      } catch (error) {
        console.log(`端口 ${port} 連接失敗:`, error);
        continue;
      }
    }
    throw new Error('無法連接到 SuperBrain 伺服器');
  }

  // 顯示擷取按鈕
  function showExtractButtons() {
    extractFullButton.style.display = 'block';
    loginButton.style.display = 'none';
  }

  // 隱藏擷取按鈕
  function hideExtractButtons() {
    extractFullButton.style.display = 'none';
    loginButton.style.display = 'block';
  }

  // 獲取所有相關的 session cookies
  async function getSessionCookies() {
    const cookies = await chrome.cookies.getAll({
      domain: 'localhost'
    });

    // 找出所有可能的 next-auth session cookies
    const sessionCookies = cookies.filter(cookie => 
      cookie.name === 'next-auth.session-token' ||
      cookie.name === '__Secure-next-auth.session-token' ||
      cookie.name === '__Host-next-auth.session-token' ||
      cookie.name.includes('next-auth.csrf-token') ||
      cookie.name.includes('next-auth.callback-url')
    );

    console.log('找到的所有 session cookies:', sessionCookies);
    return sessionCookies;
  }

  // 構建 cookie 字符串
  function buildCookieString(cookies) {
    return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
  }

  // 檢查登入狀態
  async function checkLoginStatus(port) {
    try {
      console.log('開始檢查登入狀態，端口:', port);
      
      const sessionCookies = await getSessionCookies();
      
      if (!sessionCookies || sessionCookies.length === 0) {
        console.log('找不到任何 session cookies');
        hideExtractButtons();
        return null;
      }

      console.log('找到 session cookies:', sessionCookies);
      const cookieString = buildCookieString(sessionCookies);

      // 驗證 session
      const response = await fetch(`http://localhost:${port}/api/auth/session`, {
        headers: {
          'Cookie': cookieString
        },
        credentials: 'include'
      });

      console.log('session 響應狀態:', response.status);
      const data = await response.json();
      console.log('session 響應數據:', data);

      if (data.user) {
        console.log('用戶已登入:', data.user);
        showExtractButtons();
        return { user: data.user, cookieString };
      }

      console.log('session 無效');
      hideExtractButtons();
      return null;
    } catch (error) {
      console.error('檢查登入狀態時發生錯誤:', error);
      hideExtractButtons();
      return null;
    }
  }

  try {
    const port = await checkServer();
    const authData = await checkLoginStatus(port);

    if (authData && authData.user) {
      statusContainer.textContent = `歡迎回來，${authData.user.name || authData.user.email}！`;
      showExtractButtons();

      // 設置擷取按鈕事件
      extractFullButton.addEventListener('click', async () => {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          
          const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              const elementsToRemove = document.querySelectorAll('header, footer, nav, script, style, iframe, .ad, .advertisement, .social-share');
              elementsToRemove.forEach(el => el.remove());
              
              const article = document.querySelector('article') || document.body;
              return {
                title: document.title,
                content: article.innerText
              };
            }
          });

          // 重新獲取最新的 cookies 以確保 session 有效
          const sessionCookies = await getSessionCookies();
          if (!sessionCookies || sessionCookies.length === 0) {
            throw new Error('未登入');
          }
          const cookieString = buildCookieString(sessionCookies);

          console.log('發送內容到 API，使用 cookies:', cookieString);
          const response = await fetch(`http://localhost:${port}/api/content`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': cookieString
            },
            credentials: 'include',
            body: JSON.stringify({
              url: tab.url,
              title: result.title,
              content: result.content
            })
          });

          console.log('API 響應狀態:', response.status);
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('API 錯誤響應:', errorData);
            throw new Error(errorData.error || '儲存失敗');
          }

          const responseData = await response.json();
          console.log('API 成功響應:', responseData);

          statusContainer.textContent = '內容已成功儲存！';
          setTimeout(() => window.close(), 2000);
        } catch (error) {
          console.error('獲取內容發生錯誤:', error);
          statusContainer.textContent = `錯誤：${error.message}`;
        }
      });

    } else {
      statusContainer.textContent = '您尚未登入';
      loginButton.style.display = 'block';
      loginButton.addEventListener('click', () => {
        chrome.tabs.create({ url: `http://localhost:${port}/auth/signin` });
      });
    }
  } catch (error) {
    console.error('Error:', error);
    statusContainer.textContent = error.message;
  }
}); 