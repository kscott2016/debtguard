// Runs once when the extension is installed or updated.
// Sets up default storage so the rest of the extension always has
// something sane to read from.
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get([
    "sites",
    "debtMessage",
    "avgSpend",
    "stats"
  ]);

  const defaults = {};

  if (!existing.sites) {
    defaults.sites = []; // user adds their own, empty by default
  }
  if (!existing.debtMessage) {
    defaults.debtMessage =
      "Every dollar you don't spend here is a dollar toward being debt-free.";
  }
  if (existing.avgSpend === undefined) {
    defaults.avgSpend = 50; // typical amount they'd spend, editable
  }
  if (!existing.stats) {
    defaults.stats = {
      avoided: 0,
      continued: 0,
      totalSaved: 0,
      log: [] // { site, action, amount, timestamp }
    };
  }

  if (Object.keys(defaults).length > 0) {
    await chrome.storage.local.set(defaults);
  }
});

// Central place the content script and popup both talk to.
// Keeping the actual stats-writing logic here means content.js
// and popup.js never race each other updating storage directly.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LOG_ACTION") {
    logAction(message.site, message.action).then(sendResponse);
    return true; // keep the message channel open for async response
  }
});

async function logAction(site, action) {
  const { stats, avgSpend } = await chrome.storage.local.get([
    "stats",
    "avgSpend"
  ]);

  const updated = { ...stats };
  const amount = action === "avoided" ? Number(avgSpend) || 0 : 0;

  if (action === "avoided") {
    updated.avoided += 1;
    updated.totalSaved += amount;
  } else if (action === "continued") {
    updated.continued += 1;
  }

  updated.log = [
    { site, action, amount, timestamp: Date.now() },
    ...(updated.log || [])
  ].slice(0, 200); // keep it bounded

  await chrome.storage.local.set({ stats: updated });
  return updated;
}
