// This function runs once a webpage is committed and content is loading,
// so all code will be running in the background on any domain within the
// .netflix. host name.

chrome.webNavigation.onCommitted.addListener(function (details) {

    // Chrome local storage is utilized to keep track of the initial etag,
    // and the last known etag. When they are equal, the file has not changed.
    // When they are different, a new command has been sent and should be executed.
    ls = window.localStorage;
    ls.setItem('cmd', '-1');
   
    // This function is set to run every 100ms. This means, every 100ms
    // the file that communicates between the Kinect and the Extension is
    // checked for a difference.
    window.setInterval(function () {

        // Initially, the txt file that holds the command is called with an
        // ajax GET request, and if it is successful the Etag of the file is
        // grabbed and stored.
        $.ajax({
            type: "GET",
            url: "./cmd.txt",
            datatype: "text",
        }).done(function (data) {
            // Once the file has been grabbed, the etag is compared to the last
            // known etag, and if they are different, the file is parsed. The first
            // number is the command, so the the first item in the parsed data is
            // used.
            var parsedData = data.split(" ");
            console.log(parsedData[0]);
            if (ls.getItem('cmd') != parsedData[1]) {
                ls.setItem('cmd', parsedData[1]);

                if (parsedData[0] === '1') {
                    function run() {
                        // what should run
                    }

                    chrome.tabs.executeScript({
                        code: '(' + run + ')();'
                    });
                }
            }
        });
    }, 100);
}, {
        url: [{
            hostContains: '.google.' // where the code should run
        }],
    });