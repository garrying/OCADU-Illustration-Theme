/*global FastClick:false, Masonry:false, Bloodhound:false*/

$(function() {
  
  'use strict';

  var app = {  
    init: function() {
      this._fastClick();
      this._ocadLoader();
      this._ocadHeadroom();
      this._ocadPanelSelectButtons();
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
      searchField: $('.search-field'),
      imageModal: $('#image-modal'),
      searchContainer: $('.search-container'),
      imageModalTip: $('.image-modal-tip')
    },

    _fastClick: function () {
      FastClick.attach(document.body);
    },

    _ocadLoader: function (e) {
      if (e === false) {
        app.settings.loader.velocity('fadeOut', 'fast');
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

      msnry.layout();
      
    },

    _ocadCascade: function (selector, delayNum) {
      
      var item = document.querySelectorAll(selector);
      var velocityComplete = function(ele) {
        $(ele).addClass('loaded');
      };

      for (var i = 0, items = item.length; i < items; i++) {
        $(item[i]).delay(delayNum*i).velocity({ opacity: 1, scale: 1 },{
          complete: velocityComplete
        });
      }

    },

    _ocadSearch: function () {
      var illustratorSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          url: '/wp-json/wp/v2/illustrator?filter[s]=%QUERY',
          wildcard: '%QUERY'
        }
      });
       
      illustratorSearch.initialize();
       
      app.settings.searchField.typeahead({
        hint: false
        },{
        name: 'illustratorName',
        displayKey: function(item) {
          return item.title.rendered;
        },
        source: illustratorSearch,
        limit: 10
      }).on('typeahead:select', function($e, resultsData){
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

    _ocadPanelSelect: function (e) {

      var targetPanel = $(e).data('panel');

      if ($(e).hasClass('reverse')) {
        $(e).removeClass('reverse');
        app._ocadPanelsClose();
      } else {
        $('.panel').removeClass('visible');
        $('.header-item').addClass('inactive').removeClass('reverse');
        app.settings.logo.addClass('invert');

        $(e).addClass('reverse').removeClass('inactive');
        $('.'+targetPanel).addClass('visible').attr('aria-hidden',false).focus();

        if (targetPanel === 'year-select') {
          $('.year-item').each(function(i){
            var item = $(this);
            item.delay(100*i).velocity({opacity:1,display:'flex'},{
              complete: function() {
                item.addClass('loaded');
              }
            });
          });
        }
      }
    },

    _ocadPanelSelectButtons: function () {

      app._ocadSearch();

      $('.header-item').on('click',function(){
        app._ocadPanelSelect(this);
      });
    },

    _ocadShuffle: function (elems) {

      var allElems = (function(){
      var ret = [], l = elems.length;
      while (l--) { ret[ret.length] = elems[l]; }
      return ret;
        })();

        var shuffled = (function(){
          var l = allElems.length, ret = [];
          while (l--) {
            var random = Math.floor(Math.random() * allElems.length),
              randEl = allElems[random].cloneNode(true);
            allElems.splice(random, 1);
            ret[ret.length] = randEl;
          }
          return ret; 
        })(), l = elems.length;

        while (l--) {
          elems[l].parentNode.insertBefore(shuffled[l], elems[l].nextSibling);
          elems[l].parentNode.removeChild(elems[l]);
        }
    },

    _ocadHomeLoader: function () {

      if ($('body').hasClass('home')) {

        $('.title-primary').fitText(1.05);
        $('.title-secondary').fitText(2.25, {minFontSize: '13px'});

        app._ocadShuffle( document.querySelectorAll('.gallery-item') );

        app.settings.homeTitle.velocity({ opacity: 1, scale: 1, display: 'flex'}, 'slow', function(){
          $(this).addClass('loaded').removeAttr('style');
          app._ocadHeadroom('.title');
        });
      }

      if ($(app.settings.masonryContainerHome).hasClass('illustrators-grid')) {
        $(app.settings.masonryContainerHome).imagesLoaded().done(function() {
            app._ocadMasonry(app.settings.masonryContainerHome);
            app._ocadCascade('.illustrator',100);
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

        var el = document.querySelectorAll('.emoji');

        for (var i = 0, len = el.length; i < len; i++) { 
          var size = Math.round(Math.random()*1);
          if (size > 0) {
            size = 'big';
          } else {
            size = 'normal';
          }
          var newq = makeNewPosition();
          $(el[i]).addClass(size).css({ top: newq[0]+'%', left: newq[1]+'%' });
        }
        
      }
    },

    _ocadPanelsClose: function () {
      $('.header-item').removeClass('reverse inactive');
      app.settings.imageModal.velocity('fadeOut',{duration: 180 });
      app.settings.logo.removeClass('invert');
      $(app.settings.masonryContainer).velocity({scale:1, blur:0, opacity:1},'fast');
      if ($('.panel').hasClass('visible')) {
        $('.panel').removeClass('visible').attr('aria-hidden',true).blur();
        $('.year-item').velocity({ opacity: 0, display: 'flex' },'fast').removeClass('loaded');
      }
    },

    _ocadPanelsCloseSelective: function(event) {

      if (!$(event.target).closest('#full-image').length && app.settings.imageModal.is(':visible')) {
        app.settings.imageModal.velocity('fadeOut',{duration:180});
        $(app.settings.masonryContainer).velocity({scale:1, blur:0, opacity:1},'fast');
        $('.illustrator-nav-single, .illustrator-meta-wrapper').removeClass('inactive');
      }

      if (!$(event.target).closest('.panel, .header-item').length && $('.panel').hasClass('visible')) {
        app._ocadPanelsClose();
      }

    },

    _ocadGalleryNav: function() {

      var galleryImages = [];
      var itemimgFullsrc;
      var nextImage;
      var imageIndex = 0;
      var masonryItemAnchor = document.querySelectorAll('.gallery-icon-anchor');

      if ($('body').hasClass('single')) {

        $('.illustrator-meta-wrapper-inner').velocity('fadeIn');

        $(app.settings.masonryContainer).imagesLoaded().done(function() {
          app._ocadMasonry(app.settings.masonryContainer);
          app._ocadCascade('.gallery-item',100);

          for (var i = 0, items = masonryItemAnchor.length; i < items; i++) {
            $(masonryItemAnchor[i]).data('index',i);
            var imageFullurl = $(masonryItemAnchor[i]).attr('href');
            galleryImages.push(imageFullurl);
          }

        });

      }

      /**
      * Creates initial image element
      **/

      var imageModalSetter = function(imageSource) {
        $('.image-modal-container').html(function() {
          var image = new Image();
          image.alt = 'Full illustration';
          image.className = 'image-modal-full-image';
          image.id = 'full-image';
          image.src = imageSource;

          return image;
        });
      };

      /**
      * Masonry item click
      **/

      $(app.settings.masonryContainer).on( 'click', '.gallery-icon-anchor', function( event ) {
        event.preventDefault();
        app._ocadLoader(true);
        itemimgFullsrc = $(this).attr('href');
        imageIndex = $(this).data('index');
        
        imageModalSetter(itemimgFullsrc);
        
        $('#full-image').imagesLoaded().done(function(){
          app._ocadLoader(false);
          app._ocadCursor();
          app.settings.imageModal.velocity('fadeIn', { 
            duration: 180, 
            begin: function() {
              $(app.settings.masonryContainer).velocity({scale:0.99, blur:2, opacity:0.25},'fast');
              $('.illustrator-nav-single, .illustrator-meta-wrapper').addClass('inactive');
            },
            complete: function() { 
              $('#full-image').velocity({opacity:1},'fast');
            } 
          });
        });

      });

      /**
      * Handles progressing through the gallery
      **/

      function nextElement(direction) {
        app._ocadLoader(true);

        if (direction === 'reverse') {
          --imageIndex;
        } else {
          ++imageIndex;
        }

        if (imageIndex === galleryImages.length) {
          imageIndex = 0;
        }

        if (imageIndex === -1) {
          imageIndex = galleryImages.length - 1;
        }

        nextImage = galleryImages[imageIndex];

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

      /**
      * Click event for cycling through images
      **/

      $('.image-modal-container').on('click','img',function() {
        nextElement();
      });

      /**
      * Keyboard event for cycling through images
      **/

      $(document).keydown(function(e) {
        if (app.settings.imageModal.is(':visible')) {
          if (e.keyCode === 39) {
            nextElement();
          }
          if (e.keyCode === 37) {
            nextElement('reverse');
          }
        }
      });

    },

    _ocadCursor: function() {
      $('.image-modal-container').mouseover(function(e) {
        if (!$(e.target).closest('#full-image').length) {
          app.settings.imageModalTip.html('Close');
        }
      }).mousemove(function(e) {
        if (!$(e.target).closest('#full-image').length) {
          app.settings.imageModalTip.css('top',(e.clientY + 5)+'px').css('left',(e.clientX + 5)+'px');
        }
      }).mouseout(function() {
        app.settings.imageModalTip.html('');
      });
    },

    _ocadUIbinding: function() {
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