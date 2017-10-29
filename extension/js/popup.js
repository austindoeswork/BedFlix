function getCurrentTabUrl(callback) {  
  var queryInfo = {
    active: true, 
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0]; 
    var url = tab.url;
    callback(url);
  });
}

function checkURL(statusText) {
  if (statusText == "https://www.netflix.com/browse") {
    document.getElementById('status').textContent = "Yes";
  }
  else {
    document.getElementById('status').textContent = "No";
  }
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    checkURL(url); 
  });
});