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
      masonryContainer: '#pack-content',
      masonryContainerHome: '#illustrators',
      homeTitle: $('.title'),
      header: $('.heading-inner'),
      nextItem: $('.nav-next a'),
      prevItem: $('.nav-previous a'),
      logo: $('.logo'),
      yearSelect: $('#year-select-link'),
      searchLink: $('#search-link'),
      searchField: $('.search-field'),
      imageModal: $('#image-modal'),
      searchContainer: $('.search-container'),
      imageModalTip: $('.image-modal-tip')
    },

    _fastClick: function () {
      FastClick.attach(document.body);
    },

    _urlCleanup: function () {
      $('.site-url').each(function(){
        var result = $(this).text().replace(/.*?:\/\//g,'');
        $(this).text(result);
      });
    },

    _ocadLoader: function (e) {
      if (e === false) {
        app.settings.loader.velocity('fadeOut', 'slow');
      } else {
        app.settings.loader.velocity('fadeIn', 'fast');
      }
    },

    _ocadMasonry: function (selector) {

      var container = document.querySelector(selector);
      var msnry = new Masonry( container, {
        itemSelector: '.gallery-item',
        transitionDuration: '0',
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

    _ocadHeadroom: function (element) {

      if (element === undefined) {
        element = app.settings.header;
        app.settings.header.mouseover(function(){
          $(this).removeClass('sticky-unpinned');
        });
      } else {
        element = $(element);
      }

      element.headroom({
        tolerance : {
          up : 10,
          down: 5
        },
        classes : {
          // when element is initialised
          initial : 'sticky',
          // when scrolling up
          pinned : 'sticky-pinned',
          // when scrolling down
          unpinned : 'sticky-unpinned',
          // when above offset
          top : 'sticky-top',
          // when below offset
          notTop : 'sticky-not-top'
        }
      });
    },

    _ocadYearSelect: function () {
      app.settings.yearSelect.on('click',function(){
        if ($(this).hasClass('reverse')) {
          $(this).removeClass('reverse');
          app._ocadPanelsClose();
        } else {
          $('.panel').velocity('fadeOut','fast');
          $(this).addClass('reverse').removeClass('inactive');
          app.settings.logo.addClass('invert');
          $('.year-select').velocity('fadeIn', { 
            duration: 180
          }).attr('aria-hidden',false);
          app.settings.searchLink.addClass('inactive').removeClass('reverse');
          $('.year-item').each(function(i){
            var item = $(this);
            item.delay(100*i).velocity({opacity:1,display:'flex'},{
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
          app._ocadPanelsClose();
        } else {
          $('.panel').velocity('fadeOut','fast');
          $(this).addClass('reverse').removeClass('inactive');
          app.settings.logo.addClass('invert');
          app.settings.searchContainer.velocity('fadeIn', {
            duration: 180
          }).attr('aria-hidden',false);
          app.settings.yearSelect.addClass('inactive').removeClass('reverse');
          setTimeout(function(){
            $('.search-field').focus();            
          }, 100);
        }
      });
    },

    _ocadHomeLoader: function () {

      $.fn.shuffle = function() {
        var allElems = this.get(),
            getRandom = function(max) {
              return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
              var random = getRandom(allElems.length),
                  randEl = $(allElems[random]).clone(true)[0];
                  allElems.splice(random, 1);
              return randEl;
           });
          this.each(function(i){
          $(this).replaceWith($(shuffled[i]));
        });
        return $(shuffled);
      };

      if ($('body').hasClass('home')) {
        $('.gallery-item').shuffle();
      }

      if ($('body').hasClass('home') || $('body').hasClass('archive') || $('body').hasClass('search') ) {
        app.settings.homeTitle.velocity({ opacity: 1, scale: 1, display: 'flex'}, 'slow', function(){
          $(this).addClass('loaded').removeAttr('style');
          app._ocadHeadroom('.title');
        });
        $(app.settings.masonryContainerHome).imagesLoaded().done(function() {
            app._ocadMasonry(app.settings.masonryContainerHome);
            app._ocadCascade('.illustrator',200);
          }
        );

        $('.title-primary').fitText(1.05);

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
      $('.header-item').removeClass('reverse inactive');
      app.settings.imageModal.velocity('fadeOut',{duration: 180 });
      app.settings.logo.removeClass('invert');
      $(app.settings.masonryContainer).velocity({scale:1, blur:0, opacity:1},'fast');
      if ($('.panel').is(':visible')) {
        $('.panel').velocity('fadeOut', { 
          duration: 180,
          complete: function(){
            $('.year-item').velocity({ opacity: 0, display: 'flex' },'fast').removeClass('loaded');
          }
        }).attr('aria-hidden',true);
      }
    },

    _ocadPanelsCloseSelective: function(event) {

      if (!$(event.target).closest('#full-image').length && app.settings.imageModal.is(':visible')) {
        app.settings.imageModal.velocity('fadeOut',{duration:180});
        $(app.settings.masonryContainer).velocity({scale:1, blur:0, opacity:1},'fast');
      }

      if (!$(event.target).closest('.panel, .header-item').length && $('.panel').is(':visible')) {
        app._ocadPanelsClose();
      }

    },

    _ocadGalleryNav: function () {

      var galleryImages = [];
      var itemimgFullsrc;
      var nextImage;
      var imageIndex = 1;

      if ($('body').hasClass('single')) {

        $('.illustrator-meta-wrapper-inner').velocity('fadeIn');

        $(app.settings.masonryContainer).imagesLoaded().done(function() {
          app._ocadMasonry(app.settings.masonryContainer);
          app._ocadCascade('.gallery-item',100);

          $(app.settings.masonryContainer).find('a').each(function(){
            var y = imageIndex++;
            $(this).data('index',y);
            var imageFullurl = $(this).attr('href');
            galleryImages.push(imageFullurl);
          });
        });

      }

      /**
      * Masonry item click
      **/

      $(app.settings.masonryContainer).on( 'click', '.gallery-item', function( event ) {
        event.preventDefault();
        app._ocadLoader(true);
        itemimgFullsrc = $( event.target ).closest('a').attr('href');
        imageIndex = $( event.target ).closest('a').data('index');

        $('.image-modal-container').html(function (){
          return '<img id="full-image" class="image-modal-full-image" alt="Full image" src=' + itemimgFullsrc + '>';
        });

        $('#full-image').imagesLoaded().done(function(){
          app._ocadLoader(false);
          app._ocadCursor();
          app.settings.imageModal.velocity('fadeIn', { 
            duration: 180, 
            begin: function() {
              $(app.settings.masonryContainer).velocity({scale:0.99, blur:2, opacity:0.25},'fast');
            },
            complete: function() { 
              $('#full-image').velocity({opacity:1},'fast');
            } 
          });
        });

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

      $('.image-modal-container').on('click','img',function(){
        nextElement();
      });

      // keyboard work navigation

      $(document).keydown(function(e){
        if (app.settings.imageModal.is(':visible')) {
          if (e.keyCode === 39) {
            nextElement();
          }
        }
      });

    },

    _ocadCursor: function() {
      $('.image-modal-container').mouseover(function(e){
        if (!$(e.target).closest('#full-image').length) {
          app.settings.imageModalTip.html('Close');
        }
      }).mousemove(function(e){
        if (!$(e.target).closest('#full-image').length) {
          app.settings.imageModalTip.css('top',(e.clientY + 5)+'px').css('left',(e.clientX + 5)+'px');
        }
      }).mouseout(function(){
        app.settings.imageModalTip.html('');
      });
    },

    _ocadUIbinding: function () {
      $('.close-panel').on('click', app._ocadPanelsClose);
      $(document).on('click', app._ocadPanelsCloseSelective).keydown(function(e) {
        
        if (e.keyCode === 27) {
          app._ocadPanelsClose();
        }

        if (!app.settings.imageModal.is(':visible')) {
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