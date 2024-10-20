chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractContentFromTabs") {
        // Query all open tabs
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(tab => {
                if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://') && !!tab.url) {
                    // Inject the content.js into each tab
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['src/content/content.js']
                    });
                }
            });
        });
    } else if (request.action === "extractContent") {
        // Log the extracted content in the background
        //console.log(`Content from ${request.url}:`, request.content);

        // Send the content to the fullscreen page
        chrome.runtime.sendMessage({
            action: "displayContent",
            content: request.content,
            url: request.url
        });
    }
});
