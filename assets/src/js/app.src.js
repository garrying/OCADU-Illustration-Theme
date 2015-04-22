$(function() {
  
  'use strict';

  var app = {  
    init: function() {
      this._fastClick();
      this._urlCleanup();
      this._ocadLoader();
      this._ocadSearchPanel();
      this._ocadHeadroom();
      this._ocadYearSelect();
      this._ocadEmojiCanvas();
      this._ocadHomeLoader();
      this._ocadPanelsClose();
      this._ocadGalleryNav();
      this._ocadUIbinding();
    },

    settings: {
      loader: $('.loader'), 
      masonryContainer: $('#pack-content'),
      masonryContainerHome: $('#illustrators'),
      header: $('#app-head-items'),
      nextItem: $('.nav-next a'),
      prevItem: $('.nav-previous a'),
      logo: $('.logo'),
      yearSelect: $('#year-select-link'),
      searchLink: $('#search-link'),
      searchField: $('.search-field')
    },

    _fastClick: function () {
      FastClick.attach(document.body);
    },

    _urlCleanup: function () {
      $('.meta.site a').each(function(){
        var urlString = $(this).text();
        var result = urlString.replace(/.*?:\/\//g,'');
        $(this).text(result);
      });
    },

    _ocadLoader: function (e) {
      if (e === false) {
        app.settings.loader.velocity('fadeOut', { duration: 180 });
      } else {
        app.settings.loader.velocity('fadeIn', { duration: 180 });
      }
    },

    _ocadMasonry: function (selector) {
      selector.masonry({
        itemSelector: '.gallery-item',
        transitionDuration: '250ms',
        percentPosition: true
      });
    },

    _ocadCascade: function (selector, delayNum) {
      $(selector).each(function (i) {
        var item = $(this);
        item.delay(delayNum*i).velocity({ opacity: 1, scale: 1 },{
          complete: function() {
            item.addClass('loaded');
          }
        });
      });
    },

    _ocadSearch: function () {
      var illustratorSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: '/wp-json/posts?type=illustrator&filter[posts_per_page]=100&filter[s]=%QUERY',
        limit: 10
      });
       
      illustratorSearch.initialize();
       
      app.settings.searchField.typeahead({
        hint: false
        },{
        name: 'illustratorName',
        displayKey: 'title',
        source: illustratorSearch.ttAdapter()
      }).on('typeahead:selected', function($e, resultsData){
        window.location.href = resultsData.link;
      });
    },

    _ocadHeadroom: function () {
      app.settings.header.headroom({
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
    },

    _ocadYearSelect: function () {
      app.settings.yearSelect.on('click',function(){
        if ($(this).hasClass('reverse')) {
          $(this).removeClass('reverse');
          $('.year-select').velocity('fadeOut', {
            duration: 180,
            complete: function() {
              $('.year-item').velocity({opacity: 0}).removeClass('loaded');
            }
          }).attr('aria-hidden',true);
          app.settings.searchLink.velocity('fadeIn', { 
            duration: 180
          });
          app.settings.logo.removeClass('invert');
        } else {
          $(this).addClass('reverse');
          app.settings.logo.addClass('invert');
          $('.year-select').velocity('fadeIn', { 
            duration: 180
          }).attr('aria-hidden',false);
          app.settings.searchLink.velocity({opacity: 0.3}, { duration: 180 });
          $('.year-item').each(function(i){
            var item = $(this);
            item.delay(100*i).velocity({opacity:1,display:'block'},{
              complete: function() {
                item.addClass('loaded');
              }
            });
          });
        }
      });
    },

    _ocadSearchPanel: function () {
      
      app._ocadSearch();

      app.settings.searchLink.on('click',function(){
        if ($(this).hasClass('reverse')) {
          $(this).removeClass('reverse');
          app.settings.logo.removeClass('invert');
          $('.search-container').velocity('fadeOut', { 
            duration: 180
          }).attr('aria-hidden',true);
          app.settings.yearSelect.velocity('fadeIn', { duration: 180 });
        } else {
          $(this).addClass('reverse');
          app.settings.logo.addClass('invert');
          $('.search-container').velocity('fadeIn', {
            duration: 180
          }).attr('aria-hidden',false);
          app.settings.yearSelect.velocity({ opacity: 0.3 }, { duration: 180 });
          setTimeout(function(){
            $('.search-field').focus();            
          }, 100);
        }
      });
    },

    _ocadHomeLoader: function () {
      if ($('body').hasClass('home') || $('body').hasClass('archive') || $('body').hasClass('search') ) {
        $('.title').velocity({ opacity: 1, scale: 1 },'slow');
        app.settings.masonryContainerHome.imagesLoaded().done(function() {
            app._ocadMasonry(app.settings.masonryContainerHome);
            app._ocadCascade('.illustrator',200);
          }
        );
      }
    },

    _ocadEmojiCanvas: function () {
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
    },

    _ocadPanelsClose: function () {
      $('#image-modal').velocity('fadeOut',{duration: 180 });
      $('#pack-content').velocity({scale:1, blur:0, opacity:1},'fast');
      $('.header-item').removeClass('reverse').velocity({ opacity: 1, display:'block' }, { duration: 180 });
      if ($('.panel').is(':visible')) {
        $('.panel').velocity('fadeOut', { 
          duration: 180,
          complete: function(){
            $('.year-item').velocity({ opacity: 0 }).removeClass('loaded');
          }
        }).attr('aria-hidden',true);
      }
      if (app.settings.logo.hasClass('invert')) {
        app.settings.logo.removeClass('invert');
      }
    },

    _ocadPanelsCloseSelective: function(event) {
      if (!$(event.target).closest('#full-image').length && $('#image-modal').is(':visible')) {
        $('#image-modal').velocity('fadeOut',{duration:180});
        $('#pack-content').velocity({scale:1, blur:0, opacity:1},'fast');
      }
      if (!$(event.target).closest('.year-select-container').length && $('.year-select').is(':visible')) {
        app.settings.yearSelect.removeClass('reverse');
        $('.year-select').velocity('fadeOut', { 
          duration: 180,
          complete: function(){
            $('.year-item').velocity({ opacity: 0 }).removeClass('loaded');
          }
        }).attr('aria-hidden',true);
        app.settings.searchLink.velocity({ opacity: 1, display:'block' }, { duration: 180 });
      }
      if (!$(event.target).closest('.search').length && $('.search-container').is(':visible')) {
        app.settings.searchLink.removeClass('reverse');
        $('.search-container').velocity('fadeOut', { duration: 180 }).attr('aria-hidden',true);
        app.settings.yearSelect.velocity({ opacity: 1, display:'block' }, { duration: 180 });
      }
      if (!$(event.target).closest('.panel, #year-select-link, #search-link').length) {
        app.settings.logo.removeClass('invert');
      }
    },

    _ocadGalleryNav: function () {

      var galleryImages = [];
      var itemimgFullsrc;
      var nextImage;
      var imageIndex = 1;

      app.settings.masonryContainer.imagesLoaded( function() {
        app._ocadMasonry(app.settings.masonryContainer);
        app._ocadCascade('.gallery-item',100);
        $('.illustrator-meta-wrapper-inner').velocity('fadeIn');

        app.settings.masonryContainer.find('a').each(function(){
          var y = imageIndex++;
          $(this).data('index',y);
          var imageFullurl = $(this).attr('href');
          galleryImages.push(imageFullurl);
        });

      });


      /**
      * Masonry item click
      **/

      app.settings.masonryContainer.on( 'click', '.gallery-item', function( event ) {
        event.preventDefault();
        app._ocadLoader(true);
        itemimgFullsrc = $( event.target ).closest('a').attr('href');

        $('#image-modal-container').html(function (){
          return '<img id="full-image" src=' + itemimgFullsrc + '>';
        });

        $('#full-image').imagesLoaded().done(function(){
          app._ocadLoader(false);
          app._ocadCursor();
          $('#image-modal').velocity('fadeIn', { 
            duration: 180, 
            begin: function() {
              $('#pack-content').velocity({scale:0.99, blur:2, opacity:0.25},'fast');
            },
            complete: function() { 
              $('#full-image').velocity({opacity:1},'fast');
            } 
          });
        });
        imageIndex = $( event.target ).closest('a').data('index');
      });


      function nextElement() {
        app._ocadLoader(true);
        if (imageIndex === galleryImages.length) {
          nextImage = galleryImages[0];
        } else {
          nextImage = galleryImages[imageIndex];
        }
        imageIndex = (imageIndex+1)%(galleryImages.length);
          
        $('#full-image').velocity({opacity:0}, {
          duration: 'fast',
          complete: function() {
            var image = new Image();
            image.src = nextImage;
            image.onload = function() {
              app._ocadLoader(false);
              $('#full-image').attr('src',this.src).velocity({opacity:1},'fast');
            };
          }
        });
      }

      $('#image-modal-container').on('click','img',function(){
        nextElement();
      });

      // keyboard work navigation

      $(document).keydown(function(e){
        if ($('#image-modal').is(':visible')) {
          if (e.keyCode === 39) {
            nextElement();
          }
        }
      });

    },

    _ocadCursor: function() {
      $('#image-modal-container').mouseover(function(e){
        if (!$(e.target).closest('#full-image').length) {
          $('.image-modal-tip').html('Close');
        }
      }).mousemove(function(e){
        if (!$(e.target).closest('#full-image').length) {
          $('.image-modal-tip').css('top',(e.clientY + 5)+'px').css('left',(e.clientX + 5)+'px');
        }
      }).mouseout(function(){
        $('.image-modal-tip').html('');
      });
    },

    _ocadUIbinding: function () {
      $('.close-panel').on('click', app._ocadPanelsClose);
      $(document).on('click', app._ocadPanelsCloseSelective);
      $(document).keydown(function(e) {
        
        if (e.keyCode === 27) {
          app._ocadPanelsClose();
        }

        if (!$('#image-modal').is(':visible')) {
          if (e.keyCode === 37 && app.settings.prevItem.length) {
            window.location = app.settings.prevItem.attr('href');
          } else if (e.keyCode === 39 && app.settings.nextItem.length) {
            window.location = app.settings.nextItem.attr('href');
          }
        }

      });
    }
  };

  /**
  * Window load ready
  **/

  $(window).load(function() {
    app._ocadLoader(false);
  });

  /**
  * Initialize
  **/

  app.init();

});