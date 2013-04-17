/* ocaduillustration.com */

$(function() {
  'use strict';

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
  imagesLoaded( container, function() {
    pckry = new Packery( container, {
      // options
      itemSelector: '.gallery-item',
      gutter: 5
    });
  });

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
    $(this).find('.indicator').toggleClass('visible');
    $('#year-select').toggleClass('collapsed');
  });

  setTimeout(function(){
    $('#s').teletype({
      text: '...Looking for someone?'
    });
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
          color: '#999',
          width: 1,
          length: 30
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
      pckry.layout();
      return false;
    }
    var imagelarge = $(this).attr('href');
    $('.gallery-item').removeClass('enlarge');
    $('.gallery-icon a').removeClass('active');
    $(this).addClass('active');
    $(this).parent().parent().addClass('enlarge');
    console.log(imagelarge);
    pckry.layout();
    pckry.on( 'layoutComplete', function(){
        var itemPos = $('.active').offset();
        $('body').animate({scrollTop: itemPos.top-20},100);
    });
    return false;
  });

  // Click to englarged image to close
  $('.enlarge').on('click', function(){
    $(this).find('img').remove();
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
    pckry.layout();
  };

});