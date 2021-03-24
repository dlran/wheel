let Settings = {
  containerClass: '.wheel-container',
  container: '',
  paginate: true,
  section: [],
  sectionClass: '.wheel-section',
  paginationClass: '.wheel-pagination',
  pagination: ''
}

function Wheel(element, opts) {
  return (this instanceof Wheel)
    ? this.init(element, opts)
    : new Wheel(element, opts);
}

Wheel.prototype.init = function (element, opts) {
  if (typeof element !== 'string') {
    opts = element
    element = undefined
  }
  if (element) {
    Settings['container'] = document.querySelector(element)
  } else if (!Settings['container'] && Settings['containerClass']) {
    Settings['container'] = document.querySelector(Settings['containerClass'])
  }
  Settings['section'] = Settings.container.querySelectorAll(Settings.sectionClass),
  this.paginationList = ''
  this.keepHash = ''
  this.lockW = ''
  this.lock = false
  this.posDelta = null
  this.bindEvent()
      .initSection()
      .renderPagination()
      .render()
}

Wheel.prototype.bindEvent = function() {
  window.onhashchange = () => this.render()

  let support = 'onwheel' in document.createElement('div') ? 'wheel' :
    document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll'
  document.addEventListener(support, (event) => {
    let delta
    if (support === 'wheel') {
      delta = event.deltaY
    } else {
      delta = event.originalEvent.wheelDelta || -event.originalEvent.detail
    }
    this._wheelHolder(event, delta)
  })

  return this
}

Wheel.prototype._wheelHolder = function(event, delta) {
  if (!this.lock) {
    if (delta == 0 || Math.abs(delta) < 100) { return }
    if (delta > 0 && !Settings.container.className.indexOf('noSlideDown') > -1) {
      this.slide(1)
      this.posDelta = 1
    } else if (delta < 0 && !Settings.container.className.indexOf('noSlideUp') > -1) {
      this.slide(-1)
      this.posDelta = 0
    }
    this.lock = true
    setTimeout(() => {
      this.lock = false
    }, 800)
  }
}

Wheel.prototype.render = function() {
  let _hash = Math.floor(Number(location.hash.split(/#/)[1]))
  let max_len = Settings.section.length
  if (!_hash) {
    _hash = 1
    location.hash = '#1'
  } else if (_hash < 1) {
    _hash = 1
  } else if (_hash > max_len) {
    _hash = max_len
  }

  let _activeIndex = _hash

  if (_hash === this.keepHash) {
    return false
  } else if (this.keepHash && _hash > this.keepHash) {
    this.posDelta = 1
  } else if (this.keepHash && _hash < this.keepHash) {
    this.posDelta = 0
  }
  this.keepHash = _hash

  // href hash wheel
  try { clearTimeout(this.lockW) } catch(e) {}
  this.lock = true
  this.lockW = setTimeout(() => {
    this.lock = false
  }, 800)

  Settings.section.forEach(v => {
    v.classList.remove('prep')
    v.classList.remove('active')
    v.classList.remove('next')

    let idx = v.getAttribute('data-index')
    if (idx == (_activeIndex - 1)) {
      v.classList.add('prep')
    } else if (idx == (_activeIndex)) {
      v.classList.add('active')
    } else if (idx == (_activeIndex + 1)) {
      v.classList.add('next')
    }
  })

  let actPagin = Settings.pagination.querySelector('li a.active')
  actPagin && actPagin.classList.remove('active')

  Settings.pagination.querySelector('li a[data-index="' + _activeIndex + '"]').classList.add('active')

  this.animateSection()

  return this
}

Wheel.prototype.slide = function (type) {
  let _index
  Settings.section.forEach(v => {
    if (v.className.indexOf('active') > -1) {
      _index = parseInt(v.getAttribute('data-index'))
    }
  })
  if ((_index <= Settings.section.length && _index > 1 && type === -1)
    || (_index < Settings.section.length && type === 1)) {
    location.hash = '#'+ (_index + type)
  }

  return this
}

Wheel.prototype.animateSection = function () {
  Settings.section.forEach(v => {
    if (this.posDelta === 1 && v.className.indexOf('prep') > -1) {
      v.classList.add('leave')
      let _event = (event) => {
        v.classList.remove('leave')
        v.removeEventListener('animationend', _event)
      }
      v.addEventListener('animationend', _event)
    } else if (this.posDelta !== null && v.className.indexOf('active') > -1) {
      v.classList.add(this.posDelta ? 'enter' : 'back')
      let _event = (event) => {
        v.classList.remove(this.posDelta ? 'enter' : 'back')
        v.removeEventListener('animationend', _event)
      }
      v.addEventListener('animationend', _event)
    } else if (this.posDelta === 0 && v.className.indexOf('next') > -1) {
      v.classList.add('go')
      let _event = (event) => {
        v.classList.remove('go')
        v.removeEventListener('animationend', _event)
      }
      v.addEventListener('animationend', _event)
    }
  })
  return this
}

Wheel.prototype.initSection = function(){
  Settings.section.forEach((v, i) => {
    v.setAttribute('data-index', i + 1)
    if (Settings.paginate) {
      this.paginationList += `<li><a data-index="${i + 1}" href="#${i + 1}"></a></li>`
    }
  })
  return this
}

Wheel.prototype.renderPagination = function(){
  if(!Settings.paginate) return

  let $ul = document.createElement('ul')
  $ul.innerHTML = this.paginationList
  $ul.classList.add(Settings.paginationClass.replace('.', ''))
  Settings.container.insertBefore($ul, null)
  Settings.pagination = $ul

  // bind click event
  $ul.querySelectorAll('li a').forEach(v => {
    v.onclick = () => {
      Settings.container.classList.remove('noSlideUp')
      Settings.container.classList.remove('noSlideDown')
    }
  })
  return this
}

export default Wheel

