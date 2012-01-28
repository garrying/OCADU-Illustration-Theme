$(document).ready(function() {
	
	// Sticky Illustrator Information
	
	var illustratorInfo = $('aside#illustrator-meta');
	
	var top = illustratorInfo.offset().top - parseFloat(illustratorInfo.css('marginTop').replace(/auto/, 0));
	  $(window).scroll(function (event) {
	    // what the y position of the scroll is
	    var y = $(this).scrollTop();

	    // whether that's below the form
	    if (y >= top) {
	      // if so, ad the fixed class
	      illustratorInfo.addClass('fixed');
	    } else {
	      // otherwise remove it
	      illustratorInfo.removeClass('fixed');
	    }
	  });
	
});
