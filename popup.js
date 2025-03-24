// 统一 API 命名空间
const isFF = (typeof browser != 'undefined')
const runtime = isFF ? browser.runtime : chrome.runtime;
const storage = isFF ? browser.storage : chrome.storage;
const action = isFF ? browser.action : chrome.browserAction;

// 统一 storage.get 的行为
function getStorageData(keys) {
  return new Promise((resolve) => {
    if (isFF) {
      storage.sync.get(keys).then(resolve);
    } else {
      storage.sync.get(keys, resolve);
    }
  });
}

// 统一 storage.set 的行为
function setStorageData(data) {
  return new Promise((resolve) => {
    if (isFF) {
      storage.sync.set(data).then(resolve);
    } else {
      storage.sync.set(data, resolve);
    }
  });
}

// 设置徽章背景颜色
action.setBadgeBackgroundColor({ color: "#294fa7" });

// 保存输入数据
document.getElementById('submitBtn').onclick = function () {
  saveTheInputs();
};

// 监听回车键
window.addEventListener('keyup', function (e) {
  if (e.code === "Enter") {
    saveTheInputs();
  }
}, false);

// 监听事件名称变化
document.getElementById('eventName').addEventListener('change', function (e) {
  saveTheInputs();
});

// 从存储中获取保存的日期和事件名称
getStorageData(['endDate', 'eventName']).then((savedCounterData) => {
  if (savedCounterData && savedCounterData.endDate) {
    document.getElementById('endDate').valueAsDate = new Date(savedCounterData.endDate);
    showCounterOnPopup(savedCounterData.endDate);

    if (savedCounterData.eventName) {
      document.getElementById('eventName').value = savedCounterData.eventName;
    }

    showCountDown();
  } else {
    hideCountDown();
  }
});

// 保存输入数据
function saveTheInputs() {
  let endDate = document.getElementById('endDate').value;
  let eventName = document.getElementById('eventName').value;

  if (endDate != undefined && endDate != '') {
    storeCounterData(endDate, eventName);
    document.getElementById('endDate').classList.remove('error-input');
  } else {
    document.getElementById('endDate').classList.add('error-input');
  }
}

// 存储计数器数据
function storeCounterData(endDate, eventName) {
  setStorageData({ endDate: endDate, eventName: eventName }).then(() => {
    setBadgeValue(new Date(endDate));
    showCounterOnPopup(new Date(endDate));

    document.getElementById('submitBtn').classList.add('disabled');
    setTimeout(function () {
      document.getElementById('submitBtn').classList.remove('disabled');
    }, 400);
  });
}

// 设置徽章值
function setBadgeValue(endDate) {
  var daysLeft = getDaysLeft(endDate);
  var daysToShow = daysLeft < 10000 ? daysLeft : '10 k+';
  action.setBadgeText({ text: '' + daysToShow });
}

// 在弹出窗口中显示计数器
function showCounterOnPopup(endDate) {
  var daysLeftElement = document.getElementById('days-left');
  daysLeftElement.innerHTML = getDaysLeft(new Date(endDate));
  daysLeftElement.classList.add('updated-date');
  showCountDown();

  setTimeout(function () {
    daysLeftElement.classList.remove('updated-date');
    document.getElementById('submitBtn').classList.remove('disabled');
  }, 1000);
}

// 计算剩余天数
function getDaysLeft(endDate) {
  var today = new Date();
  var one_day = 1000 * 60 * 60 * 24;
  return Math.ceil((endDate.getTime() - today.getTime()) / one_day);
}

// 显示倒计时
function showCountDown() {
  document.getElementsByClassName('countdown')[0].classList.remove('hidden');
  document.getElementById('no-date-notice').classList.add('hidden');
}

// 隐藏倒计时
function hideCountDown() {
  document.getElementsByClassName('countdown')[0].classList.add('hidden');
  document.getElementById('no-date-notice').classList.remove('hidden');
}
