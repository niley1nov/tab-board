chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	if (request.action === "extractContentFromTabs") {
		// Query and process all open tabs
		queryAndExtractTabContent();
	} else if (request.action === "extractContent") {
		// Process the extracted content from each tab
		handleExtractedContent(request);
	}

});

// Query all open tabs and inject script for content extraction
function queryAndExtractTabContent() {
	chrome.tabs.query({}, (tabs) => {
		tabs.forEach(tab => {
			if (isValidTab(tab)) {
				injectContentScript(tab);
			}
		});
	});
}

// Check if the tab is valid for content extraction
function isValidTab(tab) {
	return !tab.url.startsWith('chrome://') &&
		!tab.url.startsWith('chrome-extension://') &&
		!!tab.url;
}

// Inject inline content extraction function into the tab
function injectContentScript(tab) {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: extractContentAndSend,
		args: [tab.id, tab.title, tab.url]
	});
}

// The inline function to extract content and send it back to background.js
function extractContentAndSend(tabId, tabTitle, tabUrl) {
	const pageContent = document.body.innerText;

	// Send extracted content to background.js
	chrome.runtime.sendMessage({
		action: "extractContent",
		content: pageContent,
		tabId: tabId,
		title: tabTitle,
		url: tabUrl
	});
}

// Handle the extracted content and send it to fullscreen.js
function handleExtractedContent(request) {
	const tabData = {
		id: request.tabId,
		title: request.title,
		content: request.content,
		url: request.url
	};

	// Send the data of this single tab to the fullscreen page
	chrome.runtime.sendMessage({
		action: "sendTabData",
		tabData: tabData
	});
}