chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractContentFromTabs") {
        // Query all open tabs
        chrome.tabs.query({}, function(tabs) {
        tabs.forEach(tab => {
            if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
                console.log(tab.url);
                // Inject the content.js into each tab
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['src/content.js']
                });
            }
        });
        });
    } else if (request.action === "extractContent") {
        // Log or store the extracted content
        console.log(`Content from ${request.url}:`, request.content);
        
        // Optionally, you could store this data in localStorage or send it to the fullscreen page
    }
});