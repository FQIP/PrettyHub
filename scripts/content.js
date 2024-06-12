const cozeSpaceBotUrlReg = /\/www\.coze\.com\/space\/\d+\/bot\/\d+$/

const getInjectJsElement = () => {
  return document.querySelector("script[data-pretty-hub]")
}

const injectJs = () => {
  if (getInjectJsElement()) {
    return
  }
  let script = document.createElement("script");
  script.src = chrome.runtime.getURL("scripts/pretty-hub.js");
  script.setAttribute("data-pretty-hub", "true");
  (document.head || document.documentElement).appendChild(script);
}

injectJs()

const getInjectCssElement = () => {
  return document.querySelector("link[data-pretty-hub]")
}

const injectCss = () => {
  if (getInjectCssElement()) {
    return
  }
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("styles/pretty-hub.css");
  link.setAttribute("data-pretty-hub", "true");
  (document.head || document.documentElement).appendChild(link);
}

const removeCSS = () => {
  const injectCssElement = getInjectCssElement();
  if (injectCssElement) {
    injectCssElement.remove();
  }
}

const pretty = () => {
  if (cozeSpaceBotUrlReg.test(document.location.href)) {
    const key = 'coze_pretty_active'
    const cozePrettyActive = window.localStorage.getItem(key)
    const isActive = cozePrettyActive === 'true'
    if (!cozePrettyActive) return
    isActive ? injectCss() : removeCSS();

    chrome.runtime.sendMessage({ event: "resetIcon", data: { isActive } }, (response) => {
      console.log(response);
    });
  } else {
    removeCSS()
  }
}

// 监听localStorage变化事件
document.addEventListener('localStorageUpdated', ({ key, newValue }) => {
  pretty()
});

// 页面地址发生变化
document.addEventListener('locationChange', () => {
  pretty()
});

pretty()