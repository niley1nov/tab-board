document.getElementById('launchFullscreen').addEventListener('click', function () {
	// Open fullscreen.html and get the tab ID of the new tab
	chrome.tabs.create({ url: "src/fullscreen/fullscreen.html" }, function (fullscreenTab) {

		// Wait for the fullscreen tab to finish loading
		chrome.tabs.onUpdated.addListener(function onUpdated(tabId, changeInfo, tab) {
			// Ensure the correct tab and that the page is fully loaded
			if (tabId === fullscreenTab.id && changeInfo.status === 'complete') {
				// Now that the fullscreen page is ready, send the message to extract content from all tabs
				chrome.runtime.sendMessage({ action: "extractContentFromTabs" });

				// Remove the listener to prevent future triggers
				chrome.tabs.onUpdated.removeListener(onUpdated);
			}
		});
	});
});
