$(function() {

  if ($('body').hasClass('home')) {
    $('.illustrator').each(function(){
      var randomClass =  Math.floor(Math.random()*2);
      console.log(randomClass);
      if (randomClass === 1) {
        $(this).addClass('smaller');
      }
    });
  }

  // Packery 

  var container = document.querySelector('#content');
  var pckry = new Packery( container, {
    // options
    itemSelector: '.illustrator',
    isResizeBound: true,
    isHorizontal: true
  });

  imagesLoaded( container, function() {
    pckry.layout();
  });

});