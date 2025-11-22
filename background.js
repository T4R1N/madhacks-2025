chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Create a new tab with the same URL
    chrome.tabs.create({ url: tab.url });
  }
});