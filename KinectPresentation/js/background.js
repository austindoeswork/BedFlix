// This function runs once a webpage is committed and content is loading,
// so all code will be running in the background on any domain within the
// .netflix. host name.

chrome.webNavigation.onCommitted.addListener(function (details) {
    // Chrome local storage is utilized to keep track of the initial etag,
    // and the last known etag. When they are equal, the file has not changed.
    // When they are different, a new command has been sent and should be executed.
    ls = window.localStorage;
    ls.setItem('cmd', '0');

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
            if (ls.getItem('cmd') != parsedData[1]) {
                ls.setItem('cmd', parsedData[1]);

                // The command map is as follows:
                // 1: Pause/Play
                // 2: Volume Increase
                // 3: Volume Decrease
                // 4: Mute
                // 5: Next Episode
                // 
                // If the show does not have a next episode,
                // or if it is a movie, then nothing happens.
                // All volume increases or decreases move in
                // multiples of 10%.
                if (parsedData[0] === '1') {
                    function next() {
                        var nextEpButton = document.getElementsByClassName('next')[0];
                        nextEpButton.click();
                    }

                    chrome.tabs.executeScript({
                        code: '(' + next + ')();'
                    });
                }
            }
        });
    }, 100);
});