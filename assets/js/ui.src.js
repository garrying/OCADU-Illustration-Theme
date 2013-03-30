/* ocaduillustration.com */

$(function() {
  'use strict';

  // year select show hide
  $('#year-widget').hover(function(){
    $('#year-select').slideToggle(120);
  });

  // slide show hide for credits in navi bar
  $('#info').hover(function(){
    $('#app-head .container').css({overflow:'hidden'}).animate({ marginTop:'-44px', paddingBottom:'44px'}, 140, function(){
      $('#colophon').fadeIn(150);
    });
  }, function(){
      $('#colophon').fadeOut(150, function(){
        $('#app-head .container').css({overflow:'hidden'}).animate({ marginTop:'0', paddingBottom:'0'}, 140);
      });
    });

  // pjax support
  $(document).pjax('a', {
    container: '#content',
    fragment: '#content',
    timeout: 5000
  });
  
  // on Window Load
  window.onload = function() {
    if ($('body').hasClass('home')) {
      document.getElementById("s").focus();
    }
  };
});