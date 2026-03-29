const DEFAULT_SETTINGS = {
  enabled: true,
  removePromoted: true,
  removePuzzles: true,
  removeAddToFeed: true,
}

let settings = { ...DEFAULT_SETTINGS }

const PROMOTED_TERMS = ['Promoted', 'Patrocinado', 'Sponsorisé', 'Gesponsert', 'Promovido']

const removed = new WeakSet()

function removeEl(el) {
  if (!el || removed.has(el)) return
  removed.add(el)
  el.remove()
}

// Sobe o DOM até encontrar o container de item do feed
// LinkedIn usa componentkey="expandedXXX" em todos os itens do feed
function findFeedItem(startNode) {
  let el = startNode instanceof Element ? startNode : startNode.parentElement
  while (el && el !== document.body) {
    const key = el.getAttribute?.('componentkey') ?? ''
    if (key.startsWith('expanded')) return el
    el = el.parentElement
  }
  return null
}

function hasText(el, terms) {
  if (!el) return false
  const text = el.textContent ?? ''
  return terms.some((t) => text.includes(t))
}

// Encontra o card container do widget lateral via closest com a classe do card
// LinkedIn usa _9cbcfbdd como classe do container de cada widget no painel lateral
function findSidebarWidget(textNode) {
  const p = textNode.parentElement
  if (!p) return null
  return p.closest('[class~="_9cbcfbdd"]')
}

function cleanSidebarText(text) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.textContent.trim() === text
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP
    },
  })

  const targets = []
  let node
  while ((node = walker.nextNode())) {
    targets.push(node)
  }

  for (const textNode of targets) {
    const widget = findSidebarWidget(textNode)
    if (widget) removeEl(widget)
  }
}

function cleanPuzzles() {
  if (!settings.removePuzzles) return
  // LinkedIn usa aspas tipográficas U+2019 em vez de apóstrofo ASCII
  cleanSidebarText('Today\u2019s puzzles')
}

function cleanAddToFeed() {
  if (!settings.removeAddToFeed) return
  cleanSidebarText('Add to your feed')
}

function cleanPromoted() {
  if (!settings.removePromoted) return

  // TreeWalker para encontrar nós de texto exatos com termos de promoção
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.textContent.trim()
      return PROMOTED_TERMS.some((t) => text === t)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP
    },
  })

  const targets = []
  let node
  while ((node = walker.nextNode())) {
    targets.push(node)
  }

  for (const textNode of targets) {
    const feedItem = findFeedItem(textNode)
    if (feedItem) removeEl(feedItem)
  }
}

function cleanFeed() {
  if (!settings.enabled) return
  cleanPromoted()
  cleanPuzzles()
  cleanAddToFeed()
}

let observer = null
let debounceTimer = null

function scheduleClean() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(cleanFeed, 200)
}

function startObserver() {
  if (observer) return
  observer = new MutationObserver(scheduleClean)
  observer.observe(document.body, { childList: true, subtree: true })
  cleanFeed()
}

function stopObserver() {
  observer?.disconnect()
  observer = null
  clearTimeout(debounceTimer)
}

function applySettings(newSettings) {
  settings = { ...DEFAULT_SETTINGS, ...newSettings }
  if (settings.enabled) {
    startObserver()
    cleanFeed()
  } else {
    stopObserver()
  }
}

chrome.storage.sync.get(DEFAULT_SETTINGS, (saved) => {
  applySettings(saved)
})

chrome.storage.onChanged.addListener((changes) => {
  const updated = {}
  for (const [key, { newValue }] of Object.entries(changes)) {
    updated[key] = newValue
  }
  applySettings({ ...settings, ...updated })
})
