// Some way of hiding and revealing a navigation. Just an idea.
$("#footer-header").click(function () {
    $("#footer-menu").slideToggle("slow");
  });

// Probably going to use Masonry for some grid action.
$('.gallery').masonry({ columnWidth: 300, animate: true });

// A quick go at keyboar nav. I'm sure there is a better way at this.
$(document.documentElement).keyup(function (event) {
  // handle cursor keys
  if (event.keyCode == 37) {
		window.location = $('.prev-link a').attr('href');
  } else if (event.keyCode == 39) {
		window.location = $('.next-link a').attr('href');  
  }
});