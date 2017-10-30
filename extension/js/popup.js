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

function onClickNextEpisode() {
  chrome.extension.getBackgroundPage().console.log("Next Episode Button Clicked");
}

function onClickVolUp() {
  chrome.extension.getBackgroundPage().console.log("Volume Up Button Clicked");
}

function onClickVolDown() {
  chrome.extension.getBackgroundPage().console.log("Volume Down Button Clicked");
}

function onClickMute() {
  chrome.extension.getBackgroundPage().console.log("Mute Button Clicked");
}

document.addEventListener('DOMContentLoaded', init);

function init(){
  getCurrentTabUrl(function(url) {
    checkURL(url); 
  });

  document.getElementById('nextEp').addEventListener('click', function() {
      onClickNextEpisode();
  });  

  document.getElementById('volUp').addEventListener('click', function() {
    onClickVolUp();
  });  

  document.getElementById('volDown').addEventListener('click', function() {
    onClickVolDown();
  });

  document.getElementById('mute').addEventListener('click', function() {
    onClickMute();
  });  

};