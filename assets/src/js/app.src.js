$(function() {
  'use strict';

  // Typeahead

  var illustratorsDB;

  illustratorsDB = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: '/api/get_illustrators/'
  });

  illustratorsDB.initialize();

  $('.illustrator-search').typeahead({
    minLength: 1,
    highlight: true,
  }, {
    name: 'illustratorsDB',
    displayKey: 'title',
    templates: {
      empty: [
        '<div class="empty-message">',
        'No one matches that name.',
        '</div>'
      ].join('\n'),
      suggestion: Handlebars.compile(['<div class="illustrator-result">{{title}}</div>'].join(''))
    },
    source: illustratorsDB.ttAdapter(),
  }).on('typeahead:selected', function($e, datum){
    window.location.href = datum['url'];
  }).on('typeahead:autocompleted', function($e, datum){
    window.location.href = datum['url'];
  });

  $('.illustrator-search').on('click', function(){
    $('#year-widget').removeClass('open');
  });

  // Adaptive BGs Home Grid

  $.adaptiveBackground.run();

  // Selectors
  var container = document.querySelector('#pack-content');
  var loaderTarget = $('#loader');

  // Keyboard vars
  var nextItem = $('.nav-next a');
  var prevItem = $('.nav-previous a');

  // Homepage Random Sizing

  if ($('body').hasClass('home')) {
    $('.illustrator').each(function(){
      var randomClass =  Math.floor(Math.random()*2);
      if (randomClass === 1) {
        $(this).addClass('smaller');
      }
    });
  }

  // Homepage Cascade

  var doCascade = function (delay) {
    $('.illustrator').each(function (i) {
      var illustrator = $(this);
       setTimeout(function() {
          illustrator.addClass('loaded');
        }, delay*i);
    });
  };

  // Year Selector 

  $('.year-indicator').on('click',function(){
    $('#year-widget').toggleClass('open');
  });

  // Packery
  if (container) {
    var pckry = new Packery( container, {
      // options
      itemSelector: '.gallery-item',
      isResizeBound: true,
      isHorizontal: true,
      transitionDuration: 0
    });

    imagesLoaded( container, function() {
      pckry.layout();
    });
  }

  // Keyboard Shortcuts
  $(document).on('keydown', function (event) {
    if (event.which === 37 && (prevItem.length)) {
      window.location = prevItem.attr('href');
    } else if (event.which === 39 && (nextItem.length)) {
      window.location = nextItem.attr('href');
    }
  });

  // Image Enlarging

    // Click to enlarge gallery image
  $('.gallery-icon a').on('click', function(){

    event.preventDefault();

    if ($(this).parent().parent().hasClass('enlarge')) {
      $(this).parent().parent().removeClass('enlarge');
      $(this).find('img').attr('title','Click to View');
      pckry.layout();
      return false;
    }
    var imagelarge = $(this).attr('href');

    $('.gallery-item').removeClass('enlarge');
    $('.gallery-icon a').removeClass('active');
    $(this).find('img').attr('title','Click to Minimize');
    $(this).addClass('active');

    var img = $("<img />").attr('src', imagelarge);

    $(this).find('img').load(imagelarge, function() {
        if (!this.complete || typeof this.naturalWidth === "undefined" || this.naturalWidth === 0) {
            alert('Image failed to load. Try again.');
        } else {
          var imgSource = img[0]['src'];
          $(this).animate({'opacity':0}, 'fast', function(){
            $(this).attr('src', imgSource).attr('width', '').attr('height', '').parent().parent().parent().addClass('enlarge');
            var imgContainer = document.querySelector('.gallery');
            imagesLoaded(imgContainer, function(){
              pckry.layout();
              $('.active img').delay(300).animate({'opacity':1}, 'fast');
            });
          });
        }
    });

    pckry.on( 'layoutComplete', function(){
      var itemPos = $('.enlarge').offset();
      if (itemPos == null) {
        itemPos = $('.active').offset();
      }
      $('html, body').animate({scrollTop: itemPos.top+1},90);
    });
  });


  function stop_scroll() {
    setTimeout(function(){
      $('html, body').stop(true, false);
    },90);
  };

  $(window).on('scroll', stop_scroll);

  // Click to englarged image to close

  $('.enlarge').on('click', function(){
    $(this).find('img').fadeOut();
  });


  // When Everything is Loaded

  $(window).load(function() {
    doCascade(100);
    loaderTarget.fadeOut();
  });

});