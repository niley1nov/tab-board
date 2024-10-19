document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.requestFullscreen();
  
    chrome.tabs.query({}, function(tabs) {
      console.log('tabs');
      console.log(tabs);
    });
  });