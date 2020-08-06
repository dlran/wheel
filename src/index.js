let Settings = {
  containerClass: '.wheel-container',
  container: '',
  paginate: true,
  section: [],
  sectionClass: '.wheel-section',
  rootSectionClass: '.wheel-rootSection',
  paginationClass: '.wheel-pagination',
  pagination: ''
}

function Wheel(element, opts) {
  return (this instanceof Wheel)
    ? this.init(element, opts)
    : new Wheel(element, opts);
}

Wheel.prototype.init = function init(element, opts) {
  if (typeof element !== 'string') {
    opts = element
    element = undefined
  }
  // $wheel = this
  if (element) {
    Settings['container'] = document.querySelector(element)
  } else if (!Settings['container'] && Settings['containerClass']) {
    Settings['container'] = document.querySelector(Settings['containerClass'])
  }
  Settings['section'] = Settings.container.querySelectorAll(Settings.sectionClass),
  this.paginationList = ''
  this.keepHash = ''
  this.quietW = ''
  this.quiet = false
  this.posDelta = null
  this._bindEvent()
      ._initSection()
      ._renderPagination()
      ._render()
}

Wheel.prototype._bindEvent = function() {
  window.onhashchange = () => this._render()

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

  //Touch
  // $wheel.swipeEvents().on("swipeUp",function(){
  //     WE.slideDown();
  //     posDelta = 1;
  // }).on("swipeDown",function(){
  //     WE.slideUp();
  //     posDelta = 0;
  // });

  return this;
}

Wheel.prototype._wheelHolder = function(event, delta) {
  if (this.quiet == false) {
      if (delta == 0 || Math.abs(delta) < 100) return
      if (delta > 0 && !Settings.container.className.indexOf('noSlideDown') > -1) {
          this.slideDown()
          this.posDelta = 1
      } else if (delta < 0 && !Settings.container.className.indexOf('noSlideUp') > -1) {
          this.slideUp()
          this.posDelta = 0
      }
      this.quiet = true
      setTimeout(() => {
          this.quiet = false
      }, 1000)
  }
}

Wheel.prototype._render = function() {
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
  } else if (_hash > this.keepHash) {
    this.posDelta = 1
  } else if (_hash < this.keepHash) {
    this.posDelta = 0
  }
  this.keepHash = _hash

  //href-wheel
  try{ clearTimeout(this.quietW) }catch(e){}
  this.quiet = true
  this.quietW = setTimeout(() => {
    this.quiet = false
  }, 1000)

  Settings.section.forEach(v => {
    // reset current
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

  // activate new
  // Settings.container.querySelector(`[data-index="${_activeIndex - 1}"]`).classList.add('prep')
  // Settings.container.querySelector(`[data-index="${_activeIndex}"]`).classList.add('active')
  // Settings.container.querySelector(`[data-index="${_activeIndex} + 1"]`).classList.add('next')

  Settings.pagination.querySelector('li a[data-index="' + _activeIndex + '"]').classList.add('active')

  // transform
  this.animateSection()
  // WE.transformRootSection(_activeIndex);

  return this
}

Wheel.prototype.slideDown = function() {
  var _index
  Settings.section.forEach(v => {
    if (v.className.indexOf('active') > -1) {
      _index = parseInt(v.getAttribute('data-index'))
    }
  })
    if (_index < Settings.section.length) location.hash = '#'+ (_index + 1);

    return this
}

Wheel.prototype.slideUp = function() {
  var _index
  Settings.section.forEach(v => {
    if (v.className.indexOf('active') > -1) {
      _index = parseInt(v.getAttribute('data-index'))
    }
  })
  if (_index <= Settings.section.length && _index > 1) location.hash = '#'+ (_index - 1)

    return this
}

Wheel.prototype.swipeEvents = function() {
    return this.each(function() {

        var startX,
            startY,
            $this = $(this);

        $this.bind('touchstart', touchstart);

        function touchstart(event) {
            var touches = event.originalEvent.touches;
            if (touches && touches.length) {
                startX = touches[0].pageX;
                startY = touches[0].pageY;
                $this.bind('touchmove', touchmove);
            }
        }

        function touchmove(event) {
            var touches = event.originalEvent.touches;
            if (touches && touches.length) {
                var deltaX = startX - touches[0].pageX;
                var deltaY = startY - touches[0].pageY;

                if (deltaX >= 50) {
                    $this.trigger("swipeLeft");
                }
                if (deltaX <= -50) {
                    $this.trigger("swipeRight");
                }
                if (deltaY >= 50) {
                    $this.trigger("swipeUp");
                }
                if (deltaY <= -50) {
                    $this.trigger("swipeDown");
                }
                if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
                    $this.unbind('touchmove', touchmove);
                }
            }
            event.preventDefault();
        }

    });
};

Wheel.prototype.animateSection = function() {
  Settings.section.forEach(v => {
    if (this.posDelta === 1 && v.className.indexOf('prep') > -1) {
      v.classList.add('leave')
      v.addEventListener('animationend', (event) => { // webkitAnimationEnd
        v.classList.remove('leave')
      })
    } else if (v.className.indexOf('active') > -1) {
      v.classList.add(this.posDelta ? 'enter' : 'back')
      v.addEventListener('animationend', (event) => {
        v.classList.remove(this.posDelta ? 'enter' : 'back')
      })
    } else if (this.posDelta === 0 && v.className.indexOf('next') > -1) {
      v.classList.add('go')
      v.addEventListener('animationend', (event) => {
        v.classList.remove('go')
      })
    }
  })
  return this
}

Wheel.prototype._initSection = function(){
  Settings.section.forEach((v, i) => {
    v.setAttribute('data-index', i + 1)
    if (Settings.paginate) {
      this.paginationList += `<li><a data-index="${i + 1}" href="#${i + 1}"></a></li>`
    }
  })
  return this
}

Wheel.prototype._renderPagination = function(){
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
// WE.transformRootSection = function(index){
//     $(settings.rootSectionClass).each(function(){
//         var self = this,
//             rsArray = $(this).data('index');
//         $.each(rsArray,function(k,v){
//             $(self).removeClass('active-s'+v);
//             if(v === index){
//                 $(self).addClass('active-s'+v)
//             }
//         })
//     })
//     return this;
// }
