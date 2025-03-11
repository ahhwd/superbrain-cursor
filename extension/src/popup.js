document.addEventListener('DOMContentLoaded', async () => {
  const statusContainer = document.getElementById('status');
  const actionContainer = document.getElementById('action-container');
  const loginButton = document.getElementById('login-button');
  const extractFullButton = document.getElementById('extract-full');
  const extractSelectedButton = document.getElementById('extract-selected');

  // 檢查伺服器狀態和端口
  async function checkServer() {
    const ports = [3000, 3001, 3002, 3003];
    for (const port of ports) {
      try {
        const response = await fetch(`http://localhost:${port}/api/health`);
        if (response.ok) {
          return port;
        }
      } catch (error) {
        continue;
      }
    }
    throw new Error('無法連接到 SuperBrain 伺服器');
  }

  // 檢查登入狀態
  async function checkLoginStatus(port) {
    try {
      // 使用更寬鬆的 domain 匹配來獲取 cookie
      const cookies = await chrome.cookies.getAll({
        domain: 'localhost'
      });
      console.log('所有 cookies:', cookies);

      // 尋找 session cookie
      const sessionCookie = cookies.find(cookie => 
        cookie.name === 'next-auth.session-token' ||
        cookie.name === '__Secure-next-auth.session-token' ||
        cookie.name === '__Host-next-auth.session-token'
      );

      if (sessionCookie) {
        console.log('找到 session cookie:', sessionCookie);

        // 構建 cookie header
        const cookieHeader = `${sessionCookie.name}=${sessionCookie.value}`;
        console.log('發送的 cookie header:', cookieHeader);

        // 驗證 session
        const response = await fetch(`http://localhost:${port}/api/auth/session`, {
          method: 'GET',
          headers: {
            'Cookie': cookieHeader,
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        console.log('session 響應狀態:', response.status);
        const sessionData = await response.json();
        console.log('session 響應數據:', sessionData);

        if (sessionData && sessionData.user) {
          console.log('登入狀態：已登入', sessionData.user);
          return sessionData.user;
        }
      } else {
        console.log('找不到 session cookie');
      }
      
      console.log('登入狀態：未登入');
      return null;
    } catch (error) {
      console.error('檢查登入狀態時發生錯誤:', error);
      return null;
    }
  }

  // 儲存到 SuperBrain
  async function saveToSuperbrain(data, port) {
    try {
      const cookies = await chrome.cookies.getAll({
        domain: 'localhost'
      });
      
      const sessionCookie = cookies.find(cookie => 
        cookie.name === 'next-auth.session-token' ||
        cookie.name === '__Secure-next-auth.session-token' ||
        cookie.name === '__Host-next-auth.session-token'
      );

      if (!sessionCookie) {
        throw new Error('請重新登入');
      }

      const cookieHeader = `${sessionCookie.name}=${sessionCookie.value}`;

      const response = await fetch(`http://localhost:${port}/api/content/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader,
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('請重新登入');
        }
        throw new Error('儲存失敗');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  try {
    // 檢查可用的伺服器端口
    const port = await checkServer();
    console.log('使用端口:', port);
    
    // 檢查登入狀態
    const user = await checkLoginStatus(port);
    console.log('用戶信息:', user);

    if (user) {
      // 用戶已登入
      statusContainer.textContent = `歡迎回來，${user.name || user.email || 'User'}！`;
      loginButton.style.display = 'none';
      extractFullButton.style.display = 'block';
      extractSelectedButton.style.display = 'block';

      // 擷取全部內容的按鈕事件
      extractFullButton.addEventListener('click', async () => {
        try {
          statusContainer.textContent = '正在擷取內容...';
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              // 移除不必要的元素
              const elementsToRemove = document.querySelectorAll('script, style, iframe, nav, header, footer, .ad, .advertisement, .social-share');
              elementsToRemove.forEach(el => el.remove());
              
              // 獲取主要內容
              const article = document.querySelector('article') || document.querySelector('main') || document.body;
              return {
                title: document.title,
                url: window.location.href,
                content: article.innerText.trim()
              };
            }
          });

          if (result && result[0].result) {
            const data = result[0].result;
            statusContainer.textContent = '內容擷取成功！正在儲存...';
            
            const saveResult = await saveToSuperbrain(data, port);
            statusContainer.textContent = '內容已成功儲存！';
            setTimeout(() => {
              window.close();
            }, 2000);
          }
        } catch (error) {
          console.error('擷取內容時發生錯誤:', error);
          statusContainer.textContent = `錯誤：${error.message}`;
          if (error.message === '請重新登入') {
            loginButton.style.display = 'block';
            extractFullButton.style.display = 'none';
            extractSelectedButton.style.display = 'none';
          }
        }
      });

      // 擷取選取內容的按鈕事件
      extractSelectedButton.addEventListener('click', async () => {
        try {
          statusContainer.textContent = '正在擷取選取內容...';
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          const result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              const selectedText = window.getSelection().toString().trim();
              return {
                title: document.title,
                url: window.location.href,
                content: selectedText
              };
            }
          });

          if (result && result[0].result) {
            const data = result[0].result;
            if (data.content) {
              statusContainer.textContent = '內容擷取成功！正在儲存...';
              
              const saveResult = await saveToSuperbrain(data, port);
              statusContainer.textContent = '內容已成功儲存！';
              setTimeout(() => {
                window.close();
              }, 2000);
            } else {
              statusContainer.textContent = '請先選取要擷取的文字內容';
            }
          }
        } catch (error) {
          console.error('擷取選取內容時發生錯誤:', error);
          statusContainer.textContent = `錯誤：${error.message}`;
          if (error.message === '請重新登入') {
            loginButton.style.display = 'block';
            extractFullButton.style.display = 'none';
            extractSelectedButton.style.display = 'none';
          }
        }
      });

    } else {
      // 用戶未登入
      statusContainer.textContent = '您尚未登入';
      loginButton.style.display = 'block';
      extractFullButton.style.display = 'none';
      extractSelectedButton.style.display = 'none';

      loginButton.addEventListener('click', () => {
        chrome.tabs.create({ url: `http://localhost:${port}/auth/signin` });
      });
    }
  } catch (error) {
    console.error('Error:', error);
    statusContainer.textContent = error.message || '發生錯誤，請稍後再試';
    if (error.message === '無法連接到 SuperBrain 伺服器') {
      loginButton.style.display = 'none';
      extractFullButton.style.display = 'none';
      extractSelectedButton.style.display = 'none';
    }
  }
}); 