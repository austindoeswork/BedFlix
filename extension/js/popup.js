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

function hideDIV(divID) {
  var x = document.getElementById(divID);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function checkURL(statusText) {
  var netflixURL = statusText.substring(0, 23);

  var activity = statusText.substring(24, 29);

  // Checks if the current URL is that of Netflix.
  // If not on Netflix, display an error message
  // in div "offNetflix". If on Netflix, and not
  // currently watching a show, display an error
  // in div "else". If watching a show, display
  // controls in the div "watch".
  if (netflixURL == "https://www.netflix.com") {
    if (activity == "watch") {
      hideDIV('else');
    }
    else {
      hideDIV('watch');
    }
    hideDIV('offNetflix');
  }
  else {
    hideDIV('onNetflix');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    checkURL(url); 
  });
});