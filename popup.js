const DEFAULT_SETTINGS = { enabled: true, removePromoted: true }

chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  document.getElementById('enabled').checked = settings.enabled
})

document.getElementById('enabled').addEventListener('change', (e) => {
  chrome.storage.sync.set({ enabled: e.target.checked })
})
