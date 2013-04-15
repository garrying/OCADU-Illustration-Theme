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
  var $gallerycontainer = $('.gallery');

  $gallerycontainer.imagesLoaded( function(){
    $gallerycontainer.masonry({
      itemSelector: '.gallery-item',
      isAnimated: true,
      columnWidth: function( containerWidth ) {
        return containerWidth / 2;
      }
    });
  });

  // Year Show Hide
  $('.year-widget-toggle').on('click', function(){
    $(this).find('.indicator').toggleClass('visible');
    $('#year-select').toggleClass('collapsed');
  });


  setTimeout(function(){
    $('#s').teletype({
      text: '...Looking for someone?'
    });
  },4000);

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

  // on Window Load
  window.onload = function() {
    if ($('body').hasClass('home')) {
      document.getElementById('s').focus();
      doCascade(150);
    }
    $('#s').on('focus', function(){
      $(this).attr('placeholder', 'Search for an Illustrator');
    });
  };

});