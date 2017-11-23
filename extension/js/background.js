chrome.webNavigation.onCommitted.addListener(function (details) {
    // function readFile() {
        
    // }

    chrome.tabs.executeScript(details.tabId, {
        // code: '(' + readFile + ')();'
    });
}, {
        url: [{
            hostContains: '.netflix.'
        }],
    });