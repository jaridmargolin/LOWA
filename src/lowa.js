/* global XMLHttpRequest */

/* -----------------------------------------------------------------------------
 * lowa
 * -------------------------------------------------------------------------- */

// lowa is intended to be inlined, and as aresult we want to expose the lowa
// namespace on the window object.
var lowa = window.lowa = {}
lowa._anchor = document.createElement('a')
lowa.rootNode = document.createElement('div')
lowa.views = {}
lowa.handlers = []

/* -----------------------------------------------------------------------------
 * lowa - public apic
 * -------------------------------------------------------------------------- */

lowa.load = function (files, callback) {
  var results = []
  var complete = function (err) {
    if (!lowa.loaded) {
      lowa.loaded = true
      lowa._addStyles(results)
      lowa._executeHandlers()

      if (callback) {
        callback(err, results)
      }
    }
  }

  files.forEach(function (file, i) {
    lowa._loadFile(file.src, function (err, result) {
      results[i] = result

      if (err && file.required) {
        complete(lowa.error = err)
      } else if (results.length === files.length) {
        complete(null)
      }
    })
  })
}

lowa.ready = function (handler) {
  return lowa.loaded
    ? lowa._executeHandler(handler)
    : lowa.handlers.push(handler)
}

lowa.show = function (id) {
  var view = lowa.views[id].apply(this, Array.prototype.slice.call(arguments, 1))

  lowa.hide()
  lowa.rootNode.appendChild(lowa._createStyles(view.styles))
  lowa.rootNode.appendChild(lowa._createHtml(view.html))

  document.getElementsByTagName('body')[0].appendChild(lowa.rootNode)
}

lowa.hide = function () {
  while (lowa.rootNode.firstChild) {
    lowa.rootNode.removeChild(lowa.rootNode.firstChild)
  }
}

lowa.register = function (id, view) {
  this.views[id] = view
}

lowa.setBg = function (bg) {
  lowa.rootNode.style = 'z-index:-1;position:absolute;top:0px;left:0px;bottom:0px;right:0px;background:' + bg
}

/* -----------------------------------------------------------------------------
 * lowa - private api
 * -------------------------------------------------------------------------- */

// currently only loads css
lowa._loadFile = function (src, callback) {
  var xhr = new XMLHttpRequest()

  xhr.timeout = 30000
  xhr.overrideMimeType('text/css; charset=UTF-8')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
      var styles = lowa._createStyles(lowa._rewriteUrls(src, xhr.responseText))
      callback(null, styles)
    } else if (xhr.readyState === 4) {
      callback(new Error('Request returned with error response.'), null)
    }
  }

  xhr.open('GET', src, true)
  xhr.send(null)
}

lowa._executeHandlers = function () {
  lowa.handlers.forEach(function (handler) {
    lowa._executeHandler(handler)
  })
}

lowa._executeHandler = function (handler) {
  if (!lowa.error) {
    setTimeout(handler, 0)
  }
}

lowa._addStyles = function (styles) {
  var head = document.getElementsByTagName('head')[0]

  if (!lowa.error) {
    styles.forEach(function (style) {
      if (style) { head.appendChild(style) }
    })
  }
}

lowa._createStyles = function (styles) {
  var el = document.createElement('style')
  el.appendChild(document.createTextNode(styles || ''))

  return el
}

lowa._createHtml = function (html) {
  var el = document.createElement('div')
  el.innerHTML = html || ''

  return el
}

lowa._resolveUrl = function (url) {
  lowa._anchor.href = url
  return lowa._anchor.href
}

lowa._rewriteUrls = function (url, styles) {
  var resolvedUrl = lowa._resolveUrl(url.substring(0, url.lastIndexOf('/')))
  var baseUrl = resolvedUrl + (resolvedUrl.substr(-1) === '/' ? '' : '/')

  return styles.replace(/url\('?(.+?)'?\)/g, function (match, part) {
    return part[0] === '.'
      ? 'url(\'' + lowa._resolveUrl(baseUrl + part) + '\')'
      : match
  })
}
