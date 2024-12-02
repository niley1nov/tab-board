document.addEventListener("input", function (event) {
    if (event.target && event.target.tagName === "INPUT") { // Example: Watch all input fields
        chrome.runtime.sendMessage({
            action: "updateTabData",
            tabId: chrome.tabs.getCurrent().id,
            tabData: { title: document.title, url: window.location.href },
        });
    }
});
