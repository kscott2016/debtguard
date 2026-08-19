const statSaved = document.getElementById("stat-saved");
const statAvoided = document.getElementById("stat-avoided");
const statContinued = document.getElementById("stat-continued");
const avgSpendInput = document.getElementById("avg-spend");
const debtMessageInput = document.getElementById("debt-message");
const saveMessageBtn = document.getElementById("save-message");
const siteInput = document.getElementById("site-input");
const addSiteBtn = document.getElementById("add-site");
const siteList = document.getElementById("site-list");
const resetStatsBtn = document.getElementById("reset-stats");

async function render() {
  const { stats, avgSpend, debtMessage, sites } = await chrome.storage.local.get([
    "stats",
    "avgSpend",
    "debtMessage",
    "sites"
  ]);

  const s = stats || { avoided: 0, continued: 0, totalSaved: 0 };
  statSaved.textContent = `$${Number(s.totalSaved || 0).toLocaleString()}`;
  statAvoided.textContent = s.avoided || 0;
  statContinued.textContent = s.continued || 0;

  avgSpendInput.value = avgSpend ?? 50;
  debtMessageInput.value = debtMessage ?? "";

  siteList.innerHTML = "";
  (sites || []).forEach((site) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = site;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", async () => {
      const { sites } = await chrome.storage.local.get(["sites"]);
      const updated = sites.filter((s) => s !== site);
      await chrome.storage.local.set({ sites: updated });
      render();
    });
    li.appendChild(label);
    li.appendChild(removeBtn);
    siteList.appendChild(li);
  });
}

avgSpendInput.addEventListener("change", async () => {
  const value = Number(avgSpendInput.value) || 0;
  await chrome.storage.local.set({ avgSpend: value });
});

saveMessageBtn.addEventListener("click", async () => {
  await chrome.storage.local.set({ debtMessage: debtMessageInput.value.trim() });
  saveMessageBtn.textContent = "Saved ✓";
  setTimeout(() => (saveMessageBtn.textContent = "Save message"), 1200);
});

addSiteBtn.addEventListener("click", addSite);
siteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addSite();
});

async function addSite() {
  const raw = siteInput.value.trim().toLowerCase();
  if (!raw) return;

  // Strip protocol/path if pasted as a full URL
  const cleaned = raw
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  const { sites } = await chrome.storage.local.get(["sites"]);
  const current = sites || [];
  if (!current.includes(cleaned)) {
    await chrome.storage.local.set({ sites: [...current, cleaned] });
  }
  siteInput.value = "";
  render();
}

resetStatsBtn.addEventListener("click", async () => {
  await chrome.storage.local.set({
    stats: { avoided: 0, continued: 0, totalSaved: 0, log: [] }
  });
  render();
});

render();
