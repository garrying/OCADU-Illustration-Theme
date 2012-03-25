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
					selectMenu.find('.selected').focus();
				}
		});
	});

	// Sticky Illustrator Information
	var illustratorInfo = $('#illustrator-meta');
	var pageTitle = $('#page-title');

	if ($('body').hasClass('single')) {
		var top = illustratorInfo.offset().top;
	} else if ($('body').hasClass('archive') || $('body').hasClass('search')) {
		var topPagetitle = pageTitle.offset().top;
	}

	$(window).scroll(function (event) {
		// what the y position of the scroll is
		var y = $(this).scrollTop();
		var windowHeight = $(window).height(); 
		var illustratorInfoHeight = illustratorInfo.height() + 40;

		// whether that's below the form
		if (y >= top && illustratorInfoHeight < windowHeight || y >= topPagetitle) {
			illustratorInfo.addClass('fixed');
			pageTitle.addClass('fixed');
		} else {
			// otherwise remove it
			illustratorInfo.removeClass('fixed');
			pageTitle.removeClass('fixed');
		}
	});

	// Masonry for Illustrator Pages
	var gallery = $('.gallery');
	var galleryItems = '.gallery-item';

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

	// Resize Gallery Area 
	function galleryResize(){
		var galleryWidth = illustratorInfo.width();
		var containerWidth = $('.container').width();
		if (containerWidth >= 728) {
			gallery.width(containerWidth - galleryWidth - 20);
		} else {
			gallery.width("100%");
		}
	}
		
	if ($('body').hasClass('single')) {
	
		$(galleryResize);

		$(window).resize(function() {
			$(galleryResize);
		});
	}

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

	searchField.one('click', function () {
		$('#access').addClass('hide');
		$(this).animate({
			width: 200
		}, function () {
			$(this).find('input').animate({
				width: 150
			}).fadeTo('fast', 1);
		});
	});

	var searchTip = $('#search-tip');

	searchField.find('input').focus(function(){
		searchTip.fadeToggle();
	});
	

	// Click to scroll back to top
	var illustratorName = $('#illustrator-meta h1');

	var backTotop = function () {
		$('html, body').animate({
			scrollTop: 0
		}, 400);
	};

	pageTitle.on('click', backTotop);
	illustratorName.on('click', backTotop);

	// Homepage Load
	function doCascade(delay) {
		$('article').each(function (i) {
			$(this).delay(i * delay).animate({
				opacity: 1
			}, 500);
		});
	}

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

	gallery.spin();

	var progress = $('#progress');

	if ($('body').hasClass('home')||$('body').hasClass('archive')) {
		progress.spin();
	}

	$(window).load(function () {
		gallery.spin(false);
		progress.spin(false);
		gallery.find('img').fadeTo('fast', 1);
		if ($('body').hasClass('home')) {
			doCascade(300);
		}
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
	function montageSelect(divcollection) {
		siteTitle.mouseover(function(){
			$(this).addClass('montage');
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
	}

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
		$(this).removeClass('montage').css('background-image', '');
	});

});