$(document).ready(function() {
	
	// uniform year select
	
	$(function(){ $("select").uniform(); });
	
	// Jump menu business
	$('#illu-jumpmenu').change(function(){
	  window.location.href = $(this).val();
	 });
	
	// Sticky Illustrator Information
	
	var illustratorInfo = $('aside#illustrator-meta');
	var yearTitle = $('h1#year-title');
	
	if ($('body').hasClass('single')) {
		var top = illustratorInfo.offset().top - parseFloat(illustratorInfo.css('marginTop').replace(/auto/, 0));
	} else if ($('body').hasClass('archive')) {
		var topYeartitle = yearTitle.offset().top - parseFloat(yearTitle.css('marginTop').replace(/auto/, 0));
	}
	
  $(window).scroll(function (event) {
    // what the y position of the scroll is
    var y = $(this).scrollTop();

    // whether that's below the form
    if (y >= top || y >= topYeartitle ) {
			if ($('body').hasClass('single')) {
      	illustratorInfo.addClass('fixed'); 
			} else if ($('body').hasClass('archive')) {
				yearTitle.addClass('fixed');
			}
    } else {
      // otherwise remove it
      if ($('body').hasClass('single')) {
				illustratorInfo.removeClass('fixed');
			} else if ($('body').hasClass('archive')) {
				yearTitle.removeClass('fixed');
			}
    }
  });
	
	// Masonry for Illustrator Pages
	
	var gallery = $('.gallery');
	var galleryItems = '.gallery-item';
	
	gallery.imagesLoaded( function(){
		gallery.masonry({
			isAnimated: true,
		  itemSelector: galleryItems,
		  // set columnWidth a fraction of the container width
		  columnWidth: function( containerWidth ) {
		    return containerWidth / 2;
		  }
		});
	});
	
	// Footer copyright show hide
	
	var footerEle = $('#copyright');
	
	footerEle.toggle( function() {
		$(this).animate({marginRight:0});
	}, function() {
		$(this).animate({marginRight:-360});
	});
	
});
