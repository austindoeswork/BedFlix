// This file allows for a user to access all the same functions as
// Bedflix, by physically pressing the buttons on the extension tab.

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {
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
  if (netflixURL === "https://www.netflix.com") {
    if (activity === "watch") {
      hideDIV("else");
    }
    else {
      hideDIV("video-control");
      hideDIV("audio-control");
      hideDIV("debug-control");
    }
    hideDIV("offNetflix");
  }
  else {
    hideDIV("onNetflix");
  }
}

// Once the content of the page has been loaded, run the initialize function.
document.addEventListener("DOMContentLoaded", init);

function init() {

  // Ensure the code is only run when on netflix.
  getCurrentTabUrl(function (url) {
    checkURL(url);
  });

  // Get the information about the episode, including if there is a next episode.
  // If not a show, get the movie information.
  function findEpisode() {
    var title = document.getElementsByClassName("video-title")[0].innerHTML;
    var hasNextEp = 0;
    if (title.indexOf("span") !== -1) {
      var nextEp = "show";
      var titleSplice = title.split(/<h4>|<\/h4>/)
      var showInfo = titleSplice[2].split(/<span>|<\/span>/)
      var epTitle = showInfo[3];
      var epInfo = showInfo[1];
      if (document.getElementsByClassName('button-nfplayerNextEpisode').length === 0) {
        hasNextEp = 1;
      }
    }
    else {
      var nextEp = "movie";
      var titleSplice = title.split(/">|<\/h4>/);
      var epTitle = "";
      var epInfo = "";
    }
    
    return [nextEp,titleSplice[1],epTitle,epInfo,hasNextEp];
  }

  // Inject this code into the DOM of Netflix, instead of running in the
  // chrome extension DOM
  chrome.tabs.executeScript({
    code: '(' + findEpisode + ')();'
  }, (results) => {
    if (results[0][0] === "movie" || results[0][4]) {
      hideDIV("nextEpButton");    
    }
    console.log(results);
    document.getElementById("info").innerHTML = "<p>Currently watching a " + results[0][0] + "</p>"
    $(info).append("<p>Title: " + results[0][1] + "</p>")
    if (results[0][0] === "show"){
      $(info).append("<p>Episode Title: " + results[0][2] + "</p>");
      $(info).append("<p>Episode Info: " + results[0][3] + "</p>");
    }
  });  
};

document.addEventListener('DOMContentLoaded', buttonControl, false);

// Video control. Play button causes a currently paused video to play.
// Pause button causes a playing video to pause.
function buttonControl() {

  document.getElementById("play").addEventListener('click', () => {
    function playVideo() {
      console.log("play");
      var vid = document.querySelectorAll("video")[0];
      if (vid.paused) {
        vid.play();
      }
      else {
        vid.pause();
      }
    }

    chrome.tabs.executeScript({
      code: '(' + playVideo + ')();' 
    });
  });

  document.getElementById("nextEp").addEventListener('click', () => {
    function skipEp() {
      console.log("nextEp");
      var nextEpButton = document.getElementsByClassName('button-nfplayerNextEpisode')[0];
      nextEpButton.click();
    }

    chrome.tabs.executeScript({
      code: '(' + skipEp + ')();'
    });
  });

  // Audio control. Mute button mutes or unmutes the sound.
  // The volume up increases the volume by 10% currently, but
  // can be changed to a different amount. Similarly, the 
  // volume down currently decreases volume by 10%.
  document.getElementById("mute").addEventListener('click', () => {
    function muteVideo() {
      console.log("mute");
      var vid = document.querySelectorAll('video')[0];
      if (!vid.muted) {
        vid.muted = true;
      }
      else {
        vid.muted = false;
      }
    }

    chrome.tabs.executeScript({
      code: '(' + muteVideo + ')();'
    });
  });

  document.getElementById("volUp").addEventListener('click', () => {
    function volUpVideo() {
      console.log("volume up 10%");
      var vid = document.querySelectorAll('video')[0];
      if (vid.volume <= 0.9) {
        vid.volume = vid.volume + 0.1;
      }
      else {
        vid.volume = 1.0;
      }
    }

    chrome.tabs.executeScript({
      code: '(' + volUpVideo + ')();'
    });
  });

  document.getElementById("volDown").addEventListener('click', () => {
    function volDownVideo() {
      console.log("volume down 10%");
      var vid = document.querySelectorAll('video')[0];
      if (vid.volume >= 0.1) {
        vid.volume = vid.volume - 0.1;
      }
      else {
        vid.volume = 0.0;
      }
    }

    chrome.tabs.executeScript({
      code: '(' + volDownVideo + ')();'
    });
  });

  // Debug Info console
  document.getElementById("debug").addEventListener('click', () => {
    function viewDOM() {
      console.log(document.body);
    }

    chrome.tabs.executeScript({
      code: '(' + viewDOM + ')();' 
    });
  });
}