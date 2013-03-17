/* ocaduillustration.com */

$(function() {
  'use strict';
  $('#year-widget').hover(function(){
    $('#year-select').slideToggle(120);
  });
  
  // on Window Load
  window.onload = function() {
    if ($('body').hasClass('home')) {
      document.getElementById("s").focus();
    }
  };
});