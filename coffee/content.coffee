p = new Proxy(document)

inject = (path) ->
  p.injectScript('', null, chrome.extension.getURL(path) + "?#{new Date().getTime()}")

inject 'js/keycodes.js'
inject 'js/key-sequence-handler.js'
inject 'js/vimbanery.js'
