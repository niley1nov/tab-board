chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.action) {
		case "extractContentFromTabs":
			queryAndExtractTabContent();
			break;
		case "extractContent":
			handleExtractedContent(request);
			break;
	}
});

// Query all open tabs and inject script for content extraction
function queryAndExtractTabContent() {
	chrome.tabs.query({}, (tabs) => {
		tabs.filter(isValidTab).forEach(injectContentScript);
	});
}

// Check if the tab is valid for content extraction
function isValidTab(tab) {
	const invalidUrls = ['chrome://', 'extension://', 'edge://', 'chrome-extension://'];
	return tab.url && !invalidUrls.some(prefix => tab.url.startsWith(prefix));
}

// Inject inline content extraction function into the tab
function injectContentScript(tab) {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: extractContentAndSend,
		args: [tab.id, tab.title, tab.url]
	});
}

function extractContentAndSend(tabId, tabTitle, tabUrl) {
	// Function to extract metadata from meta tags
	function getMetaTags() {
		const metaTags = {};
		document.querySelectorAll('meta').forEach((meta) => {
			const name = meta.getAttribute('name') || meta.getAttribute('property');
			const content = meta.getAttribute('content');
			if (name && content) {
				metaTags[name] = content;
			}
		});
		return metaTags;
	}

	// Extract JSON-LD structured data (e.g., Schema.org)
	function getJSONLD() {
		const jsonLDScripts = document.querySelectorAll('script[type="application/ld+json"]');
		const jsonLDData = [];
		jsonLDScripts.forEach((script) => {
			try {
				const jsonData = JSON.parse(script.innerText);
				jsonLDData.push(jsonData);
			} catch (error) {
				console.warn("Error parsing JSON-LD:", error);
			}
		});
		return jsonLDData;
	}

	// Extract OpenGraph metadata (commonly used for social media context)
	function getOpenGraphData() {
		const openGraphData = {};
		document.querySelectorAll('meta[property^="og:"]').forEach((meta) => {
			openGraphData[meta.getAttribute('property')] = meta.getAttribute('content');
		});
		return openGraphData;
	}

	// Build the structured data to send
	const tabData = {
		title: tabTitle,
		url: tabUrl,
		tabId: tabId,
		metaTags: getMetaTags(),         // Extract meta tags
		content: document.body.innerText, // Structured text content (headings, paragraphs, etc.)
		jsonLD: getJSONLD(),             // Extract JSON-LD structured data
		openGraph: getOpenGraphData(),   // Extract OpenGraph metadata
	};

	// Send extracted content to background.js
	chrome.runtime.sendMessage({
		action: "extractContent",
		content: tabData,
		tabId: tabId,
		title: tabTitle,
		url: tabUrl
	});
}


// Handle the extracted content and send it to fullscreen.js
function handleExtractedContent(request) {
	const { tabId, title, content, url } = request;
	chrome.runtime.sendMessage({
		action: "sendTabData",
		tabData: { id: tabId, title, content, url }
	});
}
