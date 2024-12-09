;(function () {
  // Vérifie si le navigateur supporte le module preload
  const relList = document.createElement('link').relList
  if (relList && relList.supports && relList.supports('modulepreload')) return

  // Charge les liens avec rel="modulepreload"
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    preload(link)
  }

  // Observe les mutations dans le document pour ajouter des liens de préchargement
  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.tagName === 'LINK' && node.rel === 'modulepreload') {
            preload(node)
          }
        }
      }
    }
  }).observe(document, {
    childList: true,
    subtree: true,
  })

  // Fonction pour obtenir les attributs de préchargement
  function getPreloadAttributes(link) {
    const attributes = {}
    if (link.integrity) attributes.integrity = link.integrity
    if (link.referrerPolicy) attributes.referrerPolicy = link.referrerPolicy
    if (link.crossOrigin === 'use-credentials') {
      attributes.credentials = 'include'
    } else if (link.crossOrigin === 'anonymous') {
      attributes.credentials = 'omit'
    } else {
      attributes.credentials = 'same-origin'
    }
    return attributes
  }

  // Fonction pour précharger un module
  function preload(link) {
    if (link.ep) return // Évite de précharger plusieurs fois
    link.ep = true // Marque le lien comme préchargé
    const attributes = getPreloadAttributes(link)
    fetch(link.href, attributes) // Effectue la requête de préchargement
  }
})()
