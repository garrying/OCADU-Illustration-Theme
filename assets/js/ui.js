$(document).ready(function () {
	
	'use strict';

	// Year Select

	var yearSelect = $('#year-select');
	var selected = yearSelect.find('.selected').text();
	var selectMenu = $('#illu-jumpmenu');

	if ($('body').hasClass('search') !== true) {
		$('#illu-indicator').append(selected);
	}

	yearSelect.on('click', function(){
		$(this).toggleClass('open');
		selectMenu.slideToggle('fast', function(){
				if ($('body').hasClass('search') !== true) {
					$(this).find('.selected').focus();
				}
		});
	});

	// Intro Block

	var messageBlock = $('#intro');

	messageBlock.on('click', function(){
		$(this).fadeOut('fast').addClass('hidden');
	});

	var homeMessage = function () {
		var y = $(window).scrollTop();
		if (y > 100 || messageBlock.hasClass('hidden') !== false) {
			messageBlock.fadeOut('fast');
		} else {
			messageBlock.fadeIn('fast');
		}
	};

	// Sticky Illustrator Information

	var stickyBlock = $('.sticky');

	if ($('body').is('.single, .archive, .search')) {
		var top = stickyBlock.offset().top;
	}

	var fixy = function () {
		var y = $(window).scrollTop();
		var windowHeight = $(window).height(); 
		var stickyBlockHeight = stickyBlock.height() + 40;
		if (y >= top && stickyBlockHeight < windowHeight) {
			stickyBlock.addClass('fixed');
		} else {
			stickyBlock.removeClass('fixed');
		}
	};

	var didScroll = false;

	$(window).scroll(function () {
		didScroll = true;
	});

	setInterval(function () {
		if (didScroll) {
			didScroll = false;
			fixy();
			homeMessage();
		}
	}, 40);

	var gallery = $('.gallery');
	var galleryItems = '.gallery-item';
	var singleImage = $('.illustrator-image');

	gallery.find('br').remove();

	// Resize Gallery Area 
	var galleryResize = function (selector) {
		var galleryWidth = stickyBlock.innerWidth();
		var containerWidth = $('.container').width();
		if (containerWidth <= 767) {
			selector.width("100%");
		} else {
			selector.width(containerWidth - galleryWidth);
		}
	};
		
	if ($('body').hasClass('single')) {
		$(window).resize(function() {
			$(galleryResize(gallery));
			$(galleryResize(singleImage));
		});
	}

	// Masonry for Illustrator Pages

	gallery.imagesLoaded(function () {
		gallery.masonry({
			itemSelector: galleryItems,
			isAnimated: true,
			// set columnWidth a fraction of the container width
			columnWidth: function (containerWidth) {
				return containerWidth / 2;
			}
		});
	});

	// Footer copyright show hide
	var toggleEle = $('#toggle');
	var footerEle = $('#copyright');

	toggleEle.toggle(function () {
		footerEle.addClass('open');
		footerEle.animate({
			marginBottom: 0
		});
	}, function () {
		footerEle.removeClass('open');
		footerEle.animate({
			marginBottom: -56
		});
	});

	// Show Hide Search
	var searchField = $('#search');
	var searchTip = $('#search-tip');

	searchField.one('click', function () {
		$('#access').addClass('hide');
		$(this).animate({
			width: 200
		}, function () {
			$(this).addClass('visible').find('input').animate({
				width: 150
			}).fadeTo('fast', 1);
		});
	});

	searchField.find('input').focus(function(){
		searchTip.fadeToggle();
	});
	
	// Click to scroll back to top
	var backTotop = function () {
		$('html, body').animate({
			scrollTop: 0
		}, 400);
	};

	if ($('body').hasClass('single')) {
		stickyBlock.find('h1').on('click', backTotop);
	} else {
		stickyBlock.on('click', backTotop);
	}

	// Homepage Load
	var doCascade = function (delay) {
		$('article').each(function (i) {
			$(this).delay(i * delay).animate({
				opacity: 1
			}, 500);
		});
	};

	$.fn.randomize = function(childElem) {
		return this.each(function() {
		var $this = $(this);
		var elems = $this.children(childElem);
			elems.sort(function() { return (Math.round(Math.random())-0.5); });

			$this.remove(childElem);

			for (var i=0; i < elems.length; i++) {
				$this.append(elems[i]);      
			}
		});
	};

	// Loader Spinner for images
	$.fn.spin = function (opts) {
		this.each(function () {
			var $this = $(this),
				data = $this.data();
			if (data.spinner) {
				data.spinner.stop();
				delete data.spinner;
			}
			if (opts !== false) {
				data.spinner = new Spinner($.extend({
					color: '#FF6666',
					width: 2,
					length: 30
				}, opts)).spin(this);
			}
		});
		return this;
	};

	var progress = $('#progress');

	if (progress.length > 0) {
		progress.spin();
	}

	gallery.spin();

	$(window).load(function () {
		gallery.spin(false);
		progress.spin(false);
		gallery.find('img').fadeTo('fast', 1, function(){
			gallery.masonry('reload');
		});
		if ($('body').hasClass('home')) {
			$('#content').randomize('article');
			doCascade(150);
		}
		galleryResize(gallery);
		galleryResize(singleImage);
	});

	// Keyboard Shortcuts
	var nextItem = $('.nav-next a');
	var prevItem = $('.nav-previous a');

	$(document.documentElement).keyup(function (event) {
		// handle cursor keys, illustrator, work navigation
		if (event.keyCode === 37 && (prevItem.length)) {
			window.location = prevItem.attr('href');
		} else if (event.keyCode === 39 && (nextItem.length)) {
			window.location = nextItem.attr('href');
		}
	});

	// Site Title Montage!
	var siteTitle = $('#site-title a');
	var timerId = 0;
	var montageSelect = function (divcollection) {
		siteTitle.mouseover(function(){
			$(this).toggleClass('montage');
			var i = 0;
			timerId = setInterval(function(){
					var divs = $(divcollection);
					i++;
					if (i >= divs.length) {
						i = 0;
					}
					var bgImage = $(divcollection).eq(i).find('img').attr('src');
					siteTitle.css('background-image', 'url("' + bgImage + '")');
				},70);
		});
	};

	if ($('body').hasClass('single') && $('img').length > 1 ) {
		montageSelect('.gallery-icon');
	} else if ($('img').length > 1) {
		montageSelect('article');
	} else {
		siteTitle.on('hover', function() {
			$(this).toggleClass('animated');
		});
	}

	siteTitle.mouseout(function(){
		clearInterval(timerId);
		$(this).removeAttr('style').removeAttr('class');
	});

});