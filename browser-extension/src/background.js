const DEFAULT_SITE_URL = "http://localhost:3000";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.runtime.openOptionsPage();
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "siteUrlChanged") {
    chrome.action.setBadgeText({ text: "" });
  }
});

chrome.storage.sync.get({ siteUrl: DEFAULT_SITE_URL }, (data) => {
  try {
    new URL(data.siteUrl || DEFAULT_SITE_URL);
  } catch {
    chrome.storage.sync.set({ siteUrl: DEFAULT_SITE_URL });
  }
});