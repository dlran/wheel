/*!
 * jQuery.wheel v1.0.0 (https://github.com/dengliran/wheel)
 * Developed by dengliran in June 2017
 */
(function($){

	var defaults = {
		pagination: true,
		sectionClass: '.wheel-section',
		rootSectionClass: '.wheel-rootSection',
		paginationClass: '.wheel-pagination'
	};

	$.fn.swipeEvents = function() {
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

	$.fn.wheel = function(options){
		var settings = $.extend({}, defaults, options),
			$wheel = this,
			$section = $wheel.find(settings.sectionClass),
			total = $section.length,
			quiet = false,
			paginationList = "",
			posDelta = null,
			keepHash,
			WE = $.fn.wheel;
		WE.animateSection = function(){
			if(posDelta === 1){
				$(settings.sectionClass +".prep").addClass('leave').on('animationend webkitAnimationEnd',function(){
					$(this).removeClass('leave')
				})
				$(settings.sectionClass +".active").addClass('enter').on('animationend webkitAnimationEnd',function(){
					$(this).removeClass('enter')
				})
			}else if(posDelta === 0){
				$(settings.sectionClass +".active").addClass('back').on('animationend webkitAnimationEnd',function(){
					$(this).removeClass('back')
				})
				$(settings.sectionClass +".next").addClass('go').on('animationend webkitAnimationEnd',function(){
					$(this).removeClass('go')
				})
			}
			return this;
		}

		WE.transformRootSection = function(index){
			$(settings.rootSectionClass).each(function(){
				var self = this,
					rsArray = $(this).data('index');
				$.each(rsArray,function(k,v){
					$(self).removeClass('active-s'+v);
					if(v === index){
						$(self).addClass('active-s'+v)
					}
				})
			})
			return this;
		}

		WE.slideDown = function(){
			var _index = $(settings.sectionClass+".active").data("index");
			if (_index < total) location.hash = '#'+ (_index + 1);

			return this;
		}

		WE.slideUp = function(){
			var _index = $(settings.sectionClass+".active").data("index");
			if (_index <= total && _index > 1) location.hash = '#'+ (_index - 1);

			return this;
		}

		WE._render = function(){
			var _hash = Math.floor(Number(location.hash.split(/\#|\?|\//)[1]));
			if(!_hash){
				_hash = 1;
				location.hash = '#1';
			}
			if(_hash < 1) 	  _hash = 1;
			if(_hash > total) _hash = total;
			var activeIndex = _hash;

			if(_hash === keepHash) return false;
			keepHash = _hash;

			// reset current
			$(settings.sectionClass + '.prep').removeClass("prep");
			$(settings.sectionClass + '.active').removeClass("active");
			$(settings.sectionClass + '.next').removeClass("next");

			$(settings.paginationClass).find("li a" + ".active").removeClass("active");

			// activate new
			$(settings.sectionClass + "[data-index=" + (activeIndex -1) + "]").addClass("prep");
			$(settings.sectionClass + "[data-index=" + activeIndex + "]").addClass("active");
			$(settings.sectionClass + "[data-index=" + (activeIndex + 1) + "]").addClass("next");

			$(settings.paginationClass).find("li a[data-index=" + activeIndex + "]").addClass("active");

			// transform
			WE.animateSection();
			WE.transformRootSection(activeIndex);

			return this;
		}

		WE._renderPagination = function(){
			if(!settings.pagination) return;

			$('<ul>' + paginationList + '</ul>').addClass(settings.paginationClass.replace('.','')).prependTo($wheel);

			var _paginationIndex = location.hash.replace('#','')

			$(settings.paginationClass).find("li a").click(function (){
				var page_index = $(this).data("index");
				if(page_index > _paginationIndex){
					posDelta = 1;
				}else if(page_index < _paginationIndex){
					posDelta = 0;
				}
				_paginationIndex = page_index;
				location.hash = '#' + page_index;
			});

			return this
		}

		WE._bindEvent = function(){
			$(window).on('hashchange', WE._render);

			$(document).on('mousewheel DOMMouseScroll', function(event) {
				var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
				WE._wheelHolder(event, delta);
			});

			//Touch
			$wheel.swipeEvents().on("swipeUp",function(){
				WE.slideDown();
				posDelta = 1;
			}).on("swipeDown",function(){
				WE.slideUp();
				posDelta = 0;
			});

			return this;
		}

		WE._wheelHolder = function(event, delta){
			if (quiet == false) {
				if (delta == 0) return;
				if (delta < 0 && !$wheel.hasClass('noSlideDown')) {
					WE.slideDown();
					posDelta = 1;
				} else if(delta > 0 && !$wheel.hasClass('noSlideUp')) {
					WE.slideUp();
					posDelta = 0;
				};
				quiet = true;
				setTimeout(function(){
					quiet = false;
				}, 1000);
			}
		}

		WE._initSection = function(){
			$.each($section,function(i){
				$(this).attr("data-index", i+1);
				
				if(settings.pagination == true) {
					paginationList += "<li><a data-index='"+(i+1)+"' href='#" + (i+1) + "'></a></li>"
				}
			});

			return this;
		}
		

		if($(this).length)init()
		function init(){
			WE._bindEvent()
				._initSection()
				._renderPagination()
				._render()
		}
	}

})(window.jQuery);
