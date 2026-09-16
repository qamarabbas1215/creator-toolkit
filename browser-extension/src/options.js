const DEFAULT_SITE_URL = "http://localhost:3000";

const apiKeyInput = document.getElementById("apiKey");
const siteUrlInput = document.getElementById("siteUrl");
const saveBtn = document.getElementById("save");
const checkBtn = document.getElementById("check");
const statusEl = document.getElementById("status");
const openAppLink = document.getElementById("openApp");

function setStatus(text, isError) {
  statusEl.textContent = text;
  statusEl.classList.toggle("err", !!isError);
  statusEl.hidden = false;
  setTimeout(() => (statusEl.hidden = true), 6000);
}

chrome.storage.sync.get({ apiKey: "", siteUrl: DEFAULT_SITE_URL }, (data) => {
  apiKeyInput.value = data.apiKey;
  siteUrlInput.value = data.siteUrl;
});

function save() {
  const apiKey = apiKeyInput.value.trim();
  const siteUrl = siteUrlInput.value.trim().replace(/\/+$/, "") || DEFAULT_SITE_URL;
  chrome.storage.sync.set({ apiKey, siteUrl }, () => {
    setStatus("Saved.");
    chrome.runtime.sendMessage({ type: "siteUrlChanged", siteUrl });
  });
}

async function check() {
  const apiKey = apiKeyInput.value.trim();
  const siteUrl = siteUrlInput.value.trim().replace(/\/+$/, "") || DEFAULT_SITE_URL;
  if (!apiKey) {
    setStatus("Enter an API key first.", true);
    return;
  }
  try {
    const res = await fetch(`${siteUrl}/api/v1/tools/word-counter/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body: JSON.stringify({ input: "hello world" }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(`Key works — ${data.meta.remaining} calls left this hour.`);
    } else {
      setStatus(data.error || `HTTP ${res.status}`, true);
    }
  } catch (err) {
    setStatus(`Could not reach ${siteUrl}: ${err.message}`, true);
  }
}

saveBtn.addEventListener("click", save);
apiKeyInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") save();
});
checkBtn.addEventListener("click", check);
openAppLink.addEventListener("click", (e) => {
  e.preventDefault();
  const siteUrl = siteUrlInput.value.trim().replace(/\/+$/, "") || DEFAULT_SITE_URL;
  chrome.tabs.create({ url: siteUrl });
});