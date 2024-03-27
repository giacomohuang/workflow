;(function (window) {
  var svgSprite = `
  <svg>
  <symbol id="icon-arrow-right" viewBox="0 0 1024 1024"><path d="M284.646 73.102c12.646-12.345 32.906-12.102 45.252.544l409.53 419.496c12.209 12.506 12.125 32.496-.19 44.9L329.71 950.544c-12.451 12.542-32.712 12.616-45.254.164-12.542-12.451-12.616-32.712-.164-45.254l387.333-390.148-387.522-396.953c-12.222-12.52-12.105-32.502.169-44.88l.375-.372Z" /></symbol>
  <symbol id="icon-center" viewBox="0 0 1024 1024"><path d="M320 416h384v192H320z"/><path d="M416 64c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32H128v288c0 17.496-14.042 31.713-31.47 31.996L96 448c-17.673 0-32-14.327-32-32V96c0-17.673 14.327-32 32-32h320ZM608 64c-17.673 0-32 14.327-32 32 0 17.673 14.327 32 32 32h288v288c0 17.496 14.042 31.713 31.47 31.996l.53.004c17.673 0 32-14.327 32-32V96c0-17.673-14.327-32-32-32H608ZM416 960c17.673 0 32-14.327 32-32 0-17.673-14.327-32-32-32H128V608c0-17.496-14.042-31.713-31.47-31.996L96 576c-17.673 0-32 14.327-32 32v320c0 17.673 14.327 32 32 32h320ZM608 960c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h288V608c0-17.496 14.042-31.713 31.47-31.996L928 576c17.673 0 32 14.327 32 32v320c0 17.673-14.327 32-32 32H608Z"/></symbol>
  <symbol id="icon-plus" viewBox="0 0 1024 1024"><path d="M928 480c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32H96c-17.673 0-32-14.327-32-32 0-17.673 14.327-32 32-32h832Z"/><path d="M512 64c17.673 0 32 14.327 32 32v832c0 17.673-14.327 32-32 32-17.673 0-32-14.327-32-32V96c0-17.673 14.327-32 32-32Z" /></symbol>
  </svg>
  `
  var script = (function () {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  })()
  var shouldInjectCss = script.getAttribute('data-injectcss')
  var ready = function (fn) {
    if (document.addEventListener) {
      if (~['complete', 'loaded', 'interactive'].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function () {
          document.removeEventListener('DOMContentLoaded', loadFn, false)
          fn()
        }
        document.addEventListener('DOMContentLoaded', loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }
    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        init = function () {
          if (!done) {
            done = true
            fn()
          }
        }
      var polling = function () {
        try {
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        init()
      }
      polling()
      d.onreadystatechange = function () {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }
  var before = function (el, target) {
    target.parentNode.insertBefore(el, target)
  }
  var prepend = function (el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }
  function appendSvg() {
    var div, svg
    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }
  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write('<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>')
    } catch (e) {
      console && console.log(e)
    }
  }
  ready(appendSvg)
})(window)
