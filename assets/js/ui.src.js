/* ocaduillustration.com */

$(function() {
  'use strict';

  // year select show hide

  // slide show hide for credits in navi bar
  $('#info').hover(function(){

    });

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
      document.getElementById("s").focus();
      doCascade(150);
    }
    $('#s').on('focus', function(){
      $(this).attr('placeholder', 'Search for an Illustrator');
    });
  };
});