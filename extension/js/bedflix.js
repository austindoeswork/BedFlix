var play = true;

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

document.addEventListener('DOMContentLoaded', init);

function init() {

  getCurrentTabUrl(function (url) {
    checkURL(url);
  });

  function findEpisode() {
    var nextEp = document.getElementsByClassName("nextEpisode");
    var title = document.getElementsByClassName("video-title")[0].innerHTML;
    titleSplice=title.split(/<h4>|<\/h4>/)
    return [nextEp,titleSplice[1]];
  }

  chrome.tabs.executeScript({
    code: '(' + findEpisode + ')();'
  }, (results) => {
    console.log(results[0][1]);
    if (results[0][0] != '0') {
      document.getElementById('info').innerHTML = "<p>Currently watching a SHOW</p>"
      
      $("#info").append("<p>Title: " + results[0][1] + "</p>");
    }
    else {
      document.getElementById('info').innerHTML = "Currently watching a MOVIE"
    }
  });

};

document.addEventListener('DOMContentLoaded', checkTags, false);

// Video control. Play button causes a currently paused video to play.
// Pause button causes a playing video to pause.
function checkTags() {
  document.getElementById("play").addEventListener('click', () => {
    function playVideo() {
      console.log("play");
      var vid = document.querySelectorAll('video')[0];
      vid.play();
    }

    chrome.tabs.executeScript({
      code: '(' + playVideo + ')();' 
    }, (results) => {
    });
  });

  document.getElementById("pause").addEventListener('click', () => {
    function pauseVideo() {
      console.log("pause");
      var vid = document.querySelectorAll('video')[0];
      vid.pause();
    }

    chrome.tabs.executeScript({
      code: '(' + pauseVideo + ')();'
    }, (results) => {
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
      if (vid.muted == false) {
        vid.muted = true;
      }
      else {
        vid.muted = false;
      }
    }

    chrome.tabs.executeScript({
      code: '(' + muteVideo + ')();'
    }, (results) => {
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
    }, (results) => {
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
    }, (results) => {
    });
  });
}
