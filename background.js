// 统一 API 命名空间
const isFF = (typeof browser != 'undefined')
const runtime = isFF ? browser.runtime : chrome.runtime;
const storage = isFF ? browser.storage : chrome.storage;
const action = isFF ? browser.action : chrome.browserAction;

// 统一 storage.get 的行为
function getStorageData(key) {
  return new Promise((resolve) => {
    if (isFF) {
      storage.sync.get(key).then(resolve);
    } else {
      storage.sync.get(key, resolve);
    }
  });
}

// 初始化
runtime.onInstalled.addListener(() => {
  init();
});

runtime.onStartup.addListener(() => {
  init();
});

function init() {
  action.setBadgeBackgroundColor({ color: "#294fa7" });

  getStorageData('endDate').then((savedEndDate) => {
    if (savedEndDate && savedEndDate.endDate) {
      setDayCounter(new Date(savedEndDate.endDate));
    } else {
      action.setBadgeText({ text: 'Click' });
    }
  });
}

function setDayCounter(endDate) {
  const today = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const daysUntil = Math.ceil((endDate.getTime() - today.getTime()) / oneDay);

  action.setBadgeText({ text: '' + daysUntil });
}
