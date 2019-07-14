// saves the date
document.getElementById('submitBtn').onclick = function() {
    let endDate = document.getElementById('endDate').value;
    chrome.storage.sync.set({endDate: endDate}, function() {
      setBadgeValue(new Date(endDate));
      showCounterOnPopup(new Date(endDate));
      document.getElementById('submitBtn').classList.add('disabled');
      setTimeout(function() {
        document.getElementById('submitBtn').classList.remove('disabled');
      }, 400);
    });
};

window.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        document.getElementById('submitBtn').click();
    }
}, false);

// get saved date from storage
chrome.storage.sync.get('endDate', function(savedEndDate) {
  if(savedEndDate != undefined && savedEndDate != '') {
    document.getElementById('endDate').valueAsDate = new Date(savedEndDate.endDate);
    showCounterOnPopup(savedEndDate.endDate);
  }
});

function setBadgeValue(endDate) {
  var daysLeft = getDaysLeft(endDate);
  var daysToShow = daysLeft < 10000 ? daysLeft : '10 k+'
  chrome.browserAction.setBadgeText({text: '' + daysToShow});
}

function showCounterOnPopup(endDate) {
  var daysLeftElement = document.getElementById('days-left');
  daysLeftElement.innerHTML = getDaysLeft(new Date(endDate));
  daysLeftElement.classList.add('updated-date');
  setTimeout(function() {
    daysLeftElement.classList.remove('updated-date');
    document.getElementById('submitBtn').classList.remove('disabled');
  }, 1000);
}

function getDaysLeft(endDate) {
  var today = new Date();
  var one_day = 1000*60*60*24;
  return Math.ceil((endDate.getTime() - today.getTime())/one_day);
}
