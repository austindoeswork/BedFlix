chrome.webNavigation.onCommitted.addListener(function (details) {
    ls = window.localStorage;
    ls.setItem('id', 'null');
    ls.setItem('etag', 'start');
   
    window.setInterval(function () {
        $.ajax({
            type: "GET",
            url: './test.txt',
            success: function (data, status, request) {
                ls.setItem('etag', JSON.stringify(request.getResponseHeader('ETag')));
            }
        }).done(function (data) {
            if (ls.getItem('etag') != ls.getItem('id')) {
                ls.setItem('id', ls.getItem('etag'));
                var parsedData = data.split(" ");
                console.log(parsedData[0]);
                if (parsedData[0] === '1') {
                    function playVideo() {
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
                }
                else if (parsedData[0] === '2') {
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
                }
                else if (parsedData[0] === '3') {
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
                }
                else if (parsedData[0] === '4') {
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
                }
                else if (parsedData[0] === '5') {
                    function skipEp() {
                        console.log("nextEp");
                        var nextEpButton = document.getElementsByClassName('button-nfplayerNextEpisode')[0];
                        nextEpButton.click();
                    }

                    chrome.tabs.executeScript({
                        code: '(' + skipEp + ')();'
                    });
                }
            }
        });
    }, 100);
}, {
        url: [{
            hostContains: '.netflix.'
        }],
    });