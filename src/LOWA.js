/* global XMLHttpRequest */

/* -----------------------------------------------------------------------------
 * LOWA
 * -------------------------------------------------------------------------- */

// LOWA is intended to be inlined, and as aresult we want to expose the LOWA
// namespace on the window object.
var LOWA = window.LOWA = {}
LOWA.rootNode = document.createElement('div')
LOWA._anchor = document.createElement('a')
LOWA.views = {}
LOWA.handlers = []

/* -----------------------------------------------------------------------------
 * LOWA - public apic
 * -------------------------------------------------------------------------- */

LOWA.load = function (files, callback) {
  var results = []
  var complete = function (err) {
    if (!LOWA.loaded) {
      LOWA.loaded = true
      LOWA._addStyles(results)
      LOWA._executeHandlers()

      if (callback) {
        callback(err, results)
      }
    }
  }

  files.forEach(function (file, i) {
    LOWA._loadFile(file.src, function (err, result) {
      results[i] = result

      if (err && file.required) {
        complete(LOWA.error = err)
      } else if (results.length === files.length) {
        complete(null)
      }
    })
  })
}

LOWA.ready = function (handler) {
  return LOWA.loaded
    ? LOWA._executeHandler(handler)
    : LOWA.handlers.push(handler)
}

LOWA.show = function (id) {
  var view = LOWA.views[id].apply(this, Array.prototype.slice.call(arguments, 1))

  LOWA.hide()
  LOWA.rootNode.appendChild(LOWA._createStyles(view.styles))
  LOWA.rootNode.appendChild(LOWA._createHtml(view.html))

  document.getElementsByTagName('body')[0].appendChild(LOWA.rootNode)
}

LOWA.hide = function () {
  while (LOWA.rootNode.firstChild) {
    LOWA.rootNode.removeChild(LOWA.rootNode.firstChild)
  }
}

LOWA.register = function (id, view) {
  this.views[id] = view
}

LOWA.setBg = function (bg) {
  LOWA.rootNode.style = 'z-index:-1;position:absolute;top:0px;left:0px;bottom:0px;right:0px;background:' + bg
}

/* -----------------------------------------------------------------------------
 * LOWA - private api
 * -------------------------------------------------------------------------- */

// currently only loads css
LOWA._loadFile = function (src, callback) {
  var xhr = new XMLHttpRequest()

  xhr.timeout = 30000
  xhr.overrideMimeType('text/css; charset=UTF-8')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
      var styles = LOWA._createStyles(LOWA._rewriteUrls(src, xhr.responseText))
      callback(null, styles)
    } else if (xhr.readyState === 4) {
      callback(new Error('Request returned with error response.'), null)
    }
  }

  xhr.open('GET', src, true)
  xhr.send(null)
}

LOWA._executeHandlers = function () {
  LOWA.handlers.forEach(function (handler) {
    LOWA._executeHandler(handler)
  })
}

LOWA._executeHandler = function (handler) {
  if (!LOWA.error) {
    setTimeout(handler, 0)
  }
}

LOWA._addStyles = function (styles) {
  var head = document.getElementsByTagName('head')[0]

  if (!LOWA.error) {
    styles.forEach(function (style) {
      if (style) { head.appendChild(style) }
    })
  }
}

LOWA._createStyles = function (styles) {
  var el = document.createElement('style')
  el.appendChild(document.createTextNode(styles || ''))

  return el
}

LOWA._createHtml = function (html) {
  var el = document.createElement('div')
  el.innerHTML = html || ''

  return el
}

LOWA._resolveUrl = function (url) {
  LOWA._anchor.href = url
  return LOWA._anchor.href
}

LOWA._rewriteUrls = function (url, styles) {
  var resolvedUrl = LOWA._resolveUrl(url.substring(0, url.lastIndexOf('/')))
  var baseUrl = resolvedUrl + (resolvedUrl.substr(-1) === '/' ? '' : '/')

  return styles.replace(/url\('?(.+?)'?\)/g, function (match, part) {
    return part[0] === '.'
      ? 'url(\'' + LOWA._resolveUrl(baseUrl + part) + '\')'
      : match
  })
}
