const cozeSpaceBotUrlReg = /\/www\.coze\.com\/space\/\d+\/bot\/\d+$/

async function setIcon(isActive) {
  const iconPath = chrome.runtime.getURL(isActive ? 'images/star.png' : 'images/shutdown.png');
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
  async (request, sender, sendResponse) => {
    const { event, data } = request;
    if (event === "setIcon") {
      try {
        const isActive = data.isActive;
        await setIcon(isActive)
        sendResponse({ message: "图标修改成功" });
      } catch (error) {
        sendResponse({ message: "图标修改失败" });
      }
    }
  }
);

// 点击插件图标时触发
chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
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
