(function () {
	// Extract the text content of the page
	const pageContent = document.body.innerText;
	//console.log(pageContent);
	// Send the content back to the background script
	chrome.runtime.sendMessage({
		action: "extractContent",
		content: pageContent,
		url: window.location.href
	});
})();
