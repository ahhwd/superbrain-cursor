// 監聽來自 Web App 的訊息
chrome.runtime.onMessageExternal.addListener(
  async (request, sender, sendResponse) => {
    if (request.type === 'LOGIN_SUCCESS') {
      // 儲存登入資訊
      await chrome.storage.local.set({
        authToken: request.token,
        user: request.user
      });
      
      // 關閉登入頁面
      const [tab] = await chrome.tabs.query({
        url: 'http://localhost:3000/auth/signin'
      });
      
      if (tab) {
        chrome.tabs.remove(tab.id);
      }
      
      // 重新開啟擴充功能彈出視窗
      chrome.action.openPopup();
    }
  }
); 