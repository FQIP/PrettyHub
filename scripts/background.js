const cozeSpaceBotUrlReg = /\/www\.coze\.com\/space\/\d+\/bot\/\d+$/

async function resetIcon(isActive) {
  const iconPath = chrome.runtime.getURL(isActive ? 'images/active.png' : 'images/inActive.png');
  await chrome.action.setIcon({
    path: {
      16: iconPath,
      48: iconPath,
      128: iconPath,
    }
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(`图标设置失败: ${chrome.runtime.lastError.message}`);
    }
  });
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    const { event, data } = request;
    if (event === "resetIcon") {
      resetIcon(data.isActive).then(() => {
        sendResponse({ message: "图标修改成功" });
      }).catch(() => {
        sendResponse({ message: "图标修改失败" });
      })
    }
    // 表明是异步回调
    return true
  }
);

// 点击插件图标时触发
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      // 在function内执行的代码相当于是在浏览器环境下执行
      if (cozeSpaceBotUrlReg.test(document.location.href)) {
        const key = 'coze_pretty_active'
        const isActive = window.localStorage.getItem(key) === 'true'
        const nextActive = !isActive;
        window.localStorage.setItem(key, nextActive);

        const event = new Event('localStorageUpdated');
        event.key = key;
        event.value = nextActive;

        document.dispatchEvent(event);
      }
    }
  });
});
