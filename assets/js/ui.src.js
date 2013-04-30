/* ocaduillustration.com */

$(function() {
  'use strict';

  // vars
  var $viewport = $('html, body');

  // Check header has not doubled
  var checkAppHead = function () {
    var appHeadheight = $('#app-head').height();
    if (appHeadheight > 45) {
      $('#app-head').addClass('double');
    } else {
      $('#app-head').removeClass('double');
    }
  };

  checkAppHead();

  // slide show hide for credits in navi bar
  $('#info').hover(function(){
    $('#search, .year-widget-toggle').animate({opacity:0});
    $(this).html('☜');
    $('#colophon').animate({opacity:1});
  }, function(){
    $('#colophon').animate({opacity:0});
    $(this).html('✌');
    $('#search, .year-widget-toggle').animate({opacity:1});
  });

  // Typewrite effect to replace search placeholder
  $.fn.teletype = function (opts) {
    var $this = this,
        defaults = {
            animDelay: 150
        },
        settings = $.extend(defaults, opts);
    $.each(settings.text.split(''), function(i, letter){
        setTimeout(function(){
            $this.attr('placeholder', $this.attr('placeholder') + letter);
        }, settings.animDelay * i);
    });
    return this;
  };

  // Packery Stuff
  var container = document.querySelector('.gallery');
  var pckry;

  // initialize Packery after all images have loaded
  if ($('body').hasClass('single')) {
    imagesLoaded( container, function() {
      pckry = new Packery( container, {
        // options
        itemSelector: '.gallery-item',
        gutter: 5
      });
    });
  }

  // Year Show Hide
  $('.year-widget-toggle').on('click', function(){
    if ($('#year-widget').attr('data-visible') === 'true') {
      $(this).find('.indicator').removeClass('visible');
      $('#year-widget').attr('data-visible','false');
      $('#year-select').addClass('collapsed');
      $.cookie('currentlyVisible', 'false', {path: '/'});
    } else {
      $(this).find('.indicator').addClass('visible');
      $('#year-widget').attr('data-visible','true');
      $('#year-select').removeClass('collapsed');
      $.cookie('currentlyVisible', 'true', {path: '/'});
    }
  });

  if ($.cookie('currentlyVisible') === 'false') {
    $('#year-widget').attr('data-visible','false');
    $(this).find('.indicator').removeClass('visible');
    $('#year-select').addClass('collapsed');
  }

  // Fancy type in place thing for search bar in different contexts
  setTimeout(function(){
    if ($('body').hasClass('home') || $('body').hasClass('error404')) {
      $('#s').teletype({
        text: '...Search The Archive'
      });
    } else if ($('body').hasClass('single') && $('article').hasClass('illustrator')) {
      var title = $('h1').text();
      $('#s').teletype({
        text: ' ● ' + title
      });
    }
  },7000);

  // Homepage Cascade
  var doCascade = function (delay) {
    $('.illustrator img').each(function (i) {
      $(this).delay(i * delay).animate({
        opacity: 1, marginTop: 0
      }, 500, function(){
        $(this).parent().addClass('visible');
      });
    });
  };

  // Homepage Randomization
  $.fn.shuffle = function() {
    var allElems = this.get(),
        getRandom = function(max) {
          return Math.floor(Math.random() * max);
        },
        shuffled = $.map(allElems, function(){
          var random = getRandom(allElems.length),
            randEl = $(allElems[random]).clone(true)[0];
          allElems.splice(random, 1);
          return randEl;
       });

    this.each(function(i){
      $(this).replaceWith($(shuffled[i]));
    });

    return $(shuffled);
  };

  if ($('body').hasClass('home')) {
    $('#content article').shuffle();
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
          color: '#3EBB94',
          width: 5,
          radius: 50,
          length: 0
        }, opts)).spin(this);
      }
    });
    return this;
  };

  var progress = $('#progress');
  
  progress.spin();

  // Intro Block
  var messageBlock = $('#intro');

  messageBlock.on('click', function(){
    $(this).fadeOut('fast').addClass('hidden');
  });

  var homeMessage = function () {
    var y = $(window).scrollTop();
    if (y > 1 || messageBlock.hasClass('hidden') !== false) {
      messageBlock.fadeOut('fast');
    } else {
      messageBlock.fadeIn('fast');
    }
  };

  // Fixed Illustrator details
  var stickyBlock = $('.sticky');

  var fixy = function () {
    var y = $(window).scrollTop();
    var windowHeight = $(window).height(); 
    var stickyBlockHeight = stickyBlock.height();
    if (y >= 70 && stickyBlockHeight < windowHeight) {
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
      if ($('body').hasClass('home')) {
        homeMessage();
      }
    }
  }, 40);

  // Click to enlarge gallery image
  $('.gallery-icon a').on('click', function(){
    if ($(this).parent().parent().hasClass('enlarge')) {
      $(this).parent().parent().removeClass('enlarge');
      $(this).find('img').attr('title','Click to View');
      pckry.layout();
      return false;
    }
    var imagelarge = $(this).attr('href');

    $('.gallery-item').removeClass('enlarge');
    $('.gallery-icon a').removeClass('active');
    $(this).find('img').attr('title','Click to Minimize');
    $(this).addClass('active');

    var img = $("<img />").attr('src', imagelarge);
    $(this).find('img').load(imagelarge, function() {
        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
            alert('Image failed to load. Try again.');
        } else {
          var imgSource = img[0]['src'];
          $(this).attr('src', imgSource).attr('width', img[0]['width']).attr('height', img[0]['height']).parent().parent().parent().addClass('enlarge');
          pckry.layout();
        }
    });

    pckry.on( 'layoutComplete', function(){
        var itemPos = $('.active').offset();
        $('html, body').animate({scrollTop: itemPos.top-20},90);
    });
    return false;
  });

  // Click to englarged image to close
  $('.enlarge').on('click', function(){
    $(this).find('img').remove();
  });

  // Click to scroll back to top
  var backTotop = function () {
    $('html, body').animate({
      scrollTop: 0
    }, 400);
  };

  if ($('body').hasClass('single')) {
    $('.sticky').find('h1').on('click', backTotop);
  }

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

  // on Window Load
  window.onload = function() {
    if ($('body').hasClass('home')) {
      document.getElementById('s').focus();
      doCascade(150);
    }
    $('#s').on('focus', function(){
      $(this).attr('placeholder', 'Search for an Illustrator');
    });
    $('.gallery').find('img').fadeTo('fast',1, function(){
      progress.spin(false);
    });
    progress.spin(false);
  };

  $viewport.bind("mousedown DOMMouseScroll mousewheel keyup", function(){
    $viewport.stop();
  });

  // on Window Resize
  $(window).resize(function() {
    checkAppHead();
  });

});