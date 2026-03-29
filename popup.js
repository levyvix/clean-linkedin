const DEFAULT_SETTINGS = { enabled: true, removePromoted: true, removePuzzles: true, removeAddToFeed: true }

chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  document.getElementById('enabled').checked = settings.enabled
  document.getElementById('removePuzzles').checked = settings.removePuzzles
  document.getElementById('removeAddToFeed').checked = settings.removeAddToFeed
})

document.getElementById('enabled').addEventListener('change', (e) => {
  chrome.storage.sync.set({ enabled: e.target.checked })
})

document.getElementById('removePuzzles').addEventListener('change', (e) => {
  chrome.storage.sync.set({ removePuzzles: e.target.checked })
})

document.getElementById('removeAddToFeed').addEventListener('change', (e) => {
  chrome.storage.sync.set({ removeAddToFeed: e.target.checked })
})
