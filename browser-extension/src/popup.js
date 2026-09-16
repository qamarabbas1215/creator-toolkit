const SITE_URL = "http://localhost:3000";
const API_BASE = `${SITE_URL}/api/v1/tools`;

const QUICK_TOOLS = [
  "word-counter",
  "character-counter",
  "reading-time",
  "slug-generator",
  "case-converter",
  "password-generator",
  "json-formatter",
  "base64-encoder",
  "uuid-generator",
  "lorem-ipsum-generator",
  "youtube-title-generator",
  "meta-description-generator",
  "hashtag-generator",
  "sentence-counter",
];

const toolSelect = document.getElementById("toolSelect");
const input = document.getElementById("input");
const output = document.getElementById("output");
const runBtn = document.getElementById("run");
const statusEl = document.getElementById("status");

function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ apiKey: "" }, (data) => resolve(data.apiKey));
  });
}

async function loadTools() {
  try {
    const res = await fetch(`${API_BASE}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const bySlug = new Map(QUICK_TOOLS.map((s) => [s, 1]));
    const list = data.tools.filter((t) => bySlug.has(t.slug));
    if (list.length === 0) list.push(...data.tools);
    list.sort((a, b) => a.name.localeCompare(b.name));
    toolSelect.innerHTML = list
      .map((t) => `<option value="${t.slug}">${t.name}</option>`)
      .join("");
    toolSelect.dataset.loaded = "true";
  } catch (err) {
    status(`Could not load tools from ${SITE_URL}: ${err.message}`, true);
  }
}

function status(text, isError) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#b91c1c" : "#b45309";
  statusEl.hidden = false;
  setTimeout(() => (statusEl.hidden = true), 6000);
}

async function runTool() {
  const slug = toolSelect.value;
  if (!slug) return;
  const apiKey = await getApiKey();
  if (!apiKey) {
    status("No API key set — open the options page to add one.");
    chrome.runtime.openOptionsPage();
    return;
  }

  const raw = input.value.trim();
  let params = {};
  try {
    params = raw ? JSON.parse(raw) : {};
  } catch {
    params = { input: raw };
  }

  runBtn.disabled = true;
  status("Running…", false);
  try {
    const res = await fetch(`${API_BASE}/${slug}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) {
      status(data.error || `HTTP ${res.status}`);
      return;
    }
    const result = data.result;
    if (typeof result === "string") {
      output.value = result;
    } else if (result && typeof result === "object") {
      output.value = JSON.stringify(result, null, 2);
    } else {
      output.value = String(result);
    }
    status(`OK — ${data.meta.remaining} calls left this hour`, false);
  } catch (err) {
    status(`Request failed: ${err.message}`, true);
  } finally {
    runBtn.disabled = false;
  }
}

runBtn.addEventListener("click", runTool);
toolSelect.addEventListener("change", () => {
  output.value = "";
  statusEl.hidden = true;
});

document.getElementById("openSite").addEventListener("click", () => {
  chrome.tabs.create({ url: SITE_URL });
});

document.getElementById("openKeys").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: `${SITE_URL}/account` });
});

document.getElementById("openTools").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: `${SITE_URL}/tools` });
});

loadTools();