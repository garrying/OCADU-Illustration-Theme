/* ocaduillustration.com */

$(function() {
  'use strict';

  // vars
  var $viewport = $('html, body');

  // year select show hide

  // slide show hide for credits in navi bar
  $('#info').hover(function(){

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

  // Masonry Stuff

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

  // $gallerycontainer.imagesLoaded( function(){
  //   $gallerycontainer.masonry({
  //     itemSelector: '.gallery-item',
  //     isAnimated: true,
  //     columnWidth: function( containerWidth ) {
  //       return containerWidth / 2;
  //     }
  //   });
  // });

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
    if ($('body').hasClass('home')) {
      $('#s').teletype({
        text: '...Looking for someone?'
      });
    } else if ($('body').hasClass('single') && $('article').hasClass('illustrator')) {
      var title = $('h1').text();
      $('#s').teletype({
        text: ' ● ' + title
      });
    }
  },5000);

  // pjax support
  // $(document).pjax('a', {
  //   container: '#content',
  //   fragment: '#content',
  //   timeout: 5000
  // });
  
  // Homepage Cascade
  var doCascade = function (delay) {
    $('.illustrator img').each(function (i) {
      $(this).delay(i * delay).animate({
        opacity: 1
      }, 500, function(){
        $(this).parent().addClass('visible');
      });
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
          color: '#3EBB94',
          width: 1,
          length: 100
        }, opts)).spin(this);
      }
    });
    return this;
  };

  var progress = $('#progress');
  
  progress.spin();

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
    }
  }, 40);

  // Click to enlarge gallery image
  $('.gallery-icon a').on('click', function(){
    if ($(this).parent().parent().hasClass('enlarge')) {
      $(this).parent().parent().removeClass('enlarge');
      $(this).find('img').attr('title','Click to View')
      pckry.layout();
      return false;
    }
    var imagelarge = $(this).attr('href');
    $('.gallery-item').removeClass('enlarge');
    $('.gallery-icon a').removeClass('active');
    $(this).find('img').attr('title','Click to Minimize')
    $(this).addClass('active');
    $(this).parent().parent().addClass('enlarge');
    $(this).find('img').attr('src',imagelarge);
    pckry.layout();
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
  };

  $viewport.bind("mousedown DOMMouseScroll mousewheel keyup", function(e){
    $viewport.stop();
  });   

});