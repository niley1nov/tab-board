document.getElementById('launchFullscreen').addEventListener('click', function() {
    chrome.tabs.create({ url: "src/fullscreen.html" });
  });