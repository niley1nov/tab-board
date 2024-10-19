chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: 'https://www.example.com' });
  });