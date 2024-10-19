document.getElementById('launchFullscreen').addEventListener('click', function() {
  // Open fullscreen.html
  chrome.tabs.create({ url: "src/fullscreen.html" }, function(tab) {
    // Send a message to background.js to inject the content.js
    chrome.runtime.sendMessage({ action: "extractContentFromTabs" });
  });
});
