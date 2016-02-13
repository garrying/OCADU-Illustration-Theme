/*global FastClick:false, Masonry:false, Bloodhound:false*/

$(function() {
  
  'use strict';

  var app = {
    init: function() {
      this._fastClick();
      this._ocadPanelSelectButtons();
      this._ocadHomeLoader();
      this._ocadPanelsClose();
      this._ocadGalleryNav();
      this._ocadUIbinding();
    },

    settings: {
      contentContainer: '#content',
      loader: $('.loader'), 
      masonryContainer: '#pack-content',
      masonryContainerHome: '#illustrators',
      nextItem: $('.nav-next a'),
      prevItem: $('.nav-previous a'),
      searchField: $('.search-field'),
      imageModal: $('#image-modal')
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

    _ocadPanelSelectButtons: function () {
      app._ocadSearch();
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
        app._ocadShuffle( document.querySelectorAll('.gallery-item') );
      }
      if ($(app.settings.masonryContainerHome).hasClass('illustrators-grid')) {
        $(app.settings.masonryContainerHome).imagesLoaded().done(function() {
            app._ocadMasonry(app.settings.masonryContainerHome);
          }
        );
      }
    },

    _ocadPanelsClose: function () {
      app.settings.imageModal.velocity('fadeOut',{duration: 180 });
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

      if (!$(event.target).closest('.panel').length && $('.panel').hasClass('visible')) {
        app._ocadPanelsClose();
      }

    },

    _ocadGalleryNav: function() {

      var galleryImages = [];
      var nextImage;
      var imageIndex = 0;
      var masonryItemAnchor = document.querySelectorAll('.gallery-icon-anchor');

      if ($('body').hasClass('single')) {

        $(app.settings.masonryContainer).imagesLoaded().done(function() {
          app._ocadMasonry(app.settings.masonryContainer);
        });

        for (var i = 0, items = masonryItemAnchor.length; i < items; i++) {
          $(masonryItemAnchor[i]).data('index',i);
          var imageElement = $(masonryItemAnchor[i]);
          var imageSet = {
            url: imageElement.attr('href'),
            srcset: imageElement.data('srcset'),
            sizes: imageElement.data('sizes')
          };
          galleryImages.push(imageSet);
        }

      }

      /**
      * Creates initial image element
      **/

      var imageModalSetter = function(imageSource) {
        var image = new Image();
        image.alt = 'Full illustration';
        image.id = 'full-image';
        image.src = imageSource.attr('href');
        image.srcset = imageSource.data('srcset');
        image.sizes = imageSource.data('sizes');
        return image;
      };

      /**
      * Masonry item click
      **/

      $(app.settings.masonryContainer).on( 'click', '.gallery-icon-anchor', function( event ) {
        event.preventDefault();
        app._ocadLoader(true);
        var itemImage = $(this);
        imageIndex = itemImage.data('index');
        
        $('.image-modal-container').html(imageModalSetter(itemImage));
        
        $('#full-image').imagesLoaded().done(function(){
          app._ocadLoader(false);
          app.settings.imageModal.velocity('fadeIn', { 
            duration: 180, 
            begin: function() {
              $(app.settings.masonryContainer).velocity({opacity:0.25},'fast');
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

        $.Velocity.animate($('#full-image'), 'fadeOut', 'fast')
        .then( function() {
          var image = document.getElementById('full-image');
          image.src = nextImage.url;
          image.srcset = nextImage.srcset;
          image.sizes = nextImage.sizes;

          image.onload = function() {
            app._ocadLoader(false);
            $('#full-image').velocity('fadeIn','fast');
          };
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