'use strict';

/**
*
* Loader
*
**/

var loaderTarget = $('#loader');

var loader = function(e) {
  if (e === false) {
    loaderTarget.velocity('fadeOut', { duration: 180 });
  } else {
    loaderTarget.velocity('fadeIn', { duration: 180 });
  }
};

loader(true);

$(window).load(function() {
  loader(false);
});


/**
*
* Cascade function
*
**/

var doCascade = function (selector, delay) {
  $(selector).each(function (i) {
    var item = $(this);
    setTimeout(function() {
      item.velocity({ opacity: 1, scale: 1 },{
        complete: function() {
          item.addClass('loaded');
        }
      });
    }, delay*i);
  });
};


/**
*
* Typeahead search
*
**/

var illustratorSearch = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: '/wp-json/posts?type=illustrator&filter[posts_per_page]=100&filter[s]=%QUERY',
  limit: 10
});
 
illustratorSearch.initialize();
 
$('.search-field').typeahead(null, {
  name: 'illustratorName',
  displayKey: 'title',
  source: illustratorSearch.ttAdapter()
}).on('typeahead:selected', function($e, resultsData){
  window.location.href = resultsData.link;
});


/**
*
* Packery
*
**/

var container = $('#pack-content');

var galleryImages = [];
var itemimgFullsrc;
var fitWatching;
var nextImage;
var imageIndex = 1;

container.imagesLoaded( function() {
  container.packery({
    itemSelector: '.gallery-item',
    transitionDuration: '250ms',
    gutter: 20
  });
  doCascade('.gallery-item',100);
  $('.illustrator-meta-wrapper-inner').velocity('fadeIn');

  container.find('a').each(function(){
    var y = imageIndex++;
    $(this).data('index',y);
    var imageFullurl = $(this).attr('href');
    galleryImages.push(imageFullurl);
  });

});


/**
*
* Packery item click
*
**/

container.on( 'click', '.gallery-item', function( event ) {
  event.preventDefault();
  loader(true);
  itemimgFullsrc = $( event.target ).closest('a').attr('href');

  $('#image-modal-container').html(function (){
    return '<img id="full-image" src=' + itemimgFullsrc + '>';
  });

  var image = new Image();
  image.src = $('#full-image').attr('src');
  image.onload = function() {
    var loadedImage = this;
    $('#image-modal-container').html(function (){
      return '<img width='+loadedImage.width+' height='+loadedImage.height+' id="full-image" src=' + itemimgFullsrc + '>';
    });
  };

  var imgLoad = imagesLoaded( $('#full-image') );
  
  function onComplete( instance ) {
    loader(false);

    var imageFull = document.getElementById('image-modal-container');
    var imageModal = document.getElementById('image-modal');

    $('#full-image').imagesLoaded(function(){
      $('#image-modal').velocity('fadeIn', { 
        duration: 180, 
        begin: function() {
          $('#pack-content').velocity({scale:0.98},'fast');
        },
        complete: function() { 
          $('#full-image').velocity('fadeIn',{
            duration: 180,
            display: 'block'
          });
          fitWatching = fit(imageFull,imageModal,{watch:true});
        } 
      });
    });

  }

  imgLoad.on('done', onComplete );

  imageIndex = $( event.target ).closest('a').data('index');

});


function nextElement() {
  loader(true);
  if (imageIndex === galleryImages.length) {
    nextImage = galleryImages[0];
  } else {
    nextImage = galleryImages[imageIndex];
  }
  imageIndex = (imageIndex+1)%(galleryImages.length);
  
  var image = new Image();
  image.src = nextImage;
  image.onload = function() {
    var loadedImage = this;
    $('#full-image').attr({
      src: nextImage,
      height: loadedImage.height,
      width: loadedImage.width
    });
  };

  var imgLoad = imagesLoaded( $('#full-image') );

  imgLoad.on('done', function(){
    loader(false);
    console.log('complete');
    fitWatching.trigger();
  });

}

$('#image-modal-container').on('click','img',function(){
  nextElement();
});


/**
*
* Clean-up http strings
*
**/

$('.meta.site a').each(function(){
  var urlString = $(this).text();
  var result = urlString.replace(/.*?:\/\//g,'');
  $(this).text(result);
});


/**
*
* Year select
*
**/

$('#clock').on('click',function(){
  if ($(this).hasClass('reverse')) {
    $(this).removeClass('reverse');
    $('.year-select').velocity('fadeOut', { duration: 180 });
    $('#magnifying-glass').velocity('fadeIn', { duration: 180 });
  } else {
    $(this).addClass('reverse');
    $('.year-select').velocity('fadeIn', { duration: 180 });
    $('#magnifying-glass').velocity('fadeOut', { duration: 180 });
  }
});


// $('.year-item').on('click',function(){
//   $('.year-item').removeClass('active');
//   $(this).addClass('active');
// });

/**
*
* Search panel
*
**/

$('#magnifying-glass').on('click',function(){
  if ($(this).hasClass('reverse')) {
    $(this).removeClass('reverse');
    $('.search-container').velocity('fadeOut', { duration: 180 });
    $('#clock').velocity('fadeIn', { duration: 180 });
  } else {
    $(this).addClass('reverse');
    $('.search-container').velocity('fadeIn', { duration: 180 });
    $('#clock').velocity('fadeOut', { duration: 180 });

    // eccccckkkk Fix this later
    setTimeout(function(){
      $('.search-field').focus();
    },180);
  }
});


/**
 *
 * Homepage Cascading
 *
 **/

if ($('body').hasClass('home') || $('body').hasClass('archive') || $('body').hasClass('search') ) {

  var homeContainer = $('#illustrators');

  homeContainer.imagesLoaded( function() {
    homeContainer.packery({
      itemSelector: '.gallery-item',
      transitionDuration: '250ms',
      gutter: 0
    });
    doCascade('.illustrator',100);
    $('.title').velocity({ opacity: 1, scale: 1 });
  });
}

/**
*
* Homepage Illustrator effect
*
**/




/**
*
* Modal dismiss
*
**/

var closeAllPanels = function() {
  $('#image-modal').velocity('fadeOut',{duration: 180 });
  $('#pack-content').velocity({scale:1},'fast');
  $('#magnifying-glass, #clock').removeClass('reverse');
  $('.panel').velocity('fadeOut', { duration: 180 });
  if (!$('#magnifying-glass').is(':visible')) {
    $('#magnifying-glass').velocity('fadeIn', { duration: 180 });
  }
  if (!$('#clock').is(':visible')) {
    $('#clock').velocity('fadeIn', { duration: 180 });
  }
};

var closePanels = function(event) {
  if (event.type === 'keydown') {
    closeAllPanels();
  } else {
    if (!$(event.target).closest('#full-image').length) {
      $('#image-modal').velocity('fadeOut',{duration:180});
      $('#pack-content').velocity({scale:1},'fast');
    }
    if (!$(event.target).closest('.year-select-container').length) {
      $('#clock').removeClass('reverse');
      $('.year-select').velocity('fadeOut', { duration: 180 });
      if (!$('#magnifying-glass').is(':visible')) {
        $('#magnifying-glass').velocity('fadeIn', { duration: 180 });
      }
    }
    if (!$(event.target).closest('.search').length) {
      $('#magnifying-glass').removeClass('reverse');
      $('.search-container').velocity('fadeOut', { duration: 180 });
      if (!$('#clock').is(':visible')) {
        $('#clock').velocity('fadeIn', { duration: 180 });
      }
    }
  }
};


/**
*
* Headroom
*
**/

$('#app-head-items').headroom({
  tolerance : {
    up : 10,
    down: 5
  },
  classes : {
    // when element is initialised
    initial : 'sticky',
    // when scrolling up
    pinned : 'sticky--pinned',
    // when scrolling down
    unpinned : 'sticky--unpinned',
    // when above offset
    top : 'sticky--top',
    // when below offset
    notTop : 'sticky--not-top'
  },
});


/**
*
* Close panels
*
**/

$('.close-panel').on('click', closeAllPanels);

$(document).on('click', closePanels );

$(document).keydown(function(e) {
  if (e.keyCode === 27) {
    closePanels(e);
  }
});


/**
*
* 404
*
**/

if ($('body').hasClass('error404')) {
  
  var makeNewPosition = function (){      
    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 50;
    var w = $(window).width() - 50;
    var nh = Math.floor(Math.random() * h)/h * 100;
    var nw = Math.floor(Math.random() * w)/w * 100;
    return [nh,nw];
  };

  var emojiCanvas = function() {
    $('.emoji').each(function(){
      var size = Math.round(Math.random()*1);

      if (size > 0) {
        size = 'big';
      } else {
        size = 'normal';
      }
      var newq = makeNewPosition();
      $(this).addClass(size).css({ top: newq[0]+'%', left: newq[1]+'%' });
    });
  };

  emojiCanvas();
  
}


/**
*
* Initialize Functions
*
**/
