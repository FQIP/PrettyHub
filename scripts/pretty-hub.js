(function () {
  // 记录当前URL
  let currentUrl = location.href;

  // 监听popstate事件
  window.addEventListener('popstate', function (event) {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      document.dispatchEvent(new Event('locationChange'));
    }
  });

  // 拦截pushState方法
  const pushState = history.pushState;
  history.pushState = function (state) {
    const result = pushState.apply(history, arguments);
    document.dispatchEvent(new Event('locationChange'));
    return result;
  };

  // 拦截replaceState方法
  const replaceState = history.replaceState;
  history.replaceState = function (state) {
    const result = replaceState.apply(history, arguments);
    document.dispatchEvent(new Event('locationChange'));
    return result;
  };
})();
