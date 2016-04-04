var $ = require('jquery');
window.jQuery = window.$ = $;
require('typeahead.js');
require('velocity-animate');
require('imagesloaded');
require('./libs/jquery-text-mix');
var Masonry = require('masonry-layout');
var FastClick = require('fastclick');
var Bloodhound = require('bloodhound');

( function() {

  'use strict';

  var app = {
    init: function() {
      this._fastClick();
      this._ocadPanelSelectButtons();
      this._ocadHomeLoader();
      this._ocadGalleryNav();
      this._ocadUIbinding();
      this._ocadTextScramblerMoments();
    },

    settings: {
      contentContainer: '#content',
      logo: $('.logo'),
      loader: $('.loader'),
      masonryContainer: '#pack-content',
      masonryContainerHome: '#illustrators',
      nextItem: $('.nav-next a'),
      prevItem: $('.nav-previous a'),
      searchField: $('.search-field'),
      imageModal: $('#image-modal'),
      imageIndex: 0
    },

    _fastClick: function () {
      FastClick(document.body);
    },

    _ocadTextScrambler: function (ele, originText, newText, duration) {
      var t = $(ele);
      t.hover(() => {
        t.textMix(newText, duration, 'linear');
      }, () => {
        t.textMix(originText, duration, 'linear');
      });
    },

    _ocadTextScramblerMoments: function () {
      var thesis = $('.thesis-title');
      var illustrator = $('.illustrator-meta-name');
      var yearSelect = $('#year-select-link');
      var searchSelect = $('#search-link');
      app._ocadTextScrambler(thesis, thesis.text(), thesis.text() + ' by ' + illustrator.text(), 500);
      app._ocadTextScrambler(illustrator, illustrator.text(), illustrator.text() + ', class of ' + $('.year-item.active').text(), 500);
      app._ocadTextScrambler(yearSelect, yearSelect.text(), yearSelect.text() + ', spanning 2009 to 2016', 500);
      app._ocadTextScrambler(searchSelect, searchSelect.text(), searchSelect.text() + ' the archives', 500);
      // app._ocadTextScrambler(logo, logo.text(), logo.text() + ' featuring work from the graduating class of 2016', 500);
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
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
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
        $(item[i]).delay(delayNum*i).velocity({ opacity: 1 },{
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
      }).on('typeahead:asyncrequest', function() {
        $('.search-loader').velocity('stop').velocity('fadeIn','fast');
      })
      .on('typeahead:asyncreceive', function() {
        $('.search-loader').velocity('stop').velocity('fadeOut','fast');
      });
    },

    _ocadPanelSelect: function (e) {

      var targetPanel = $(e).data('panel');

      if ($(e).hasClass('reverse')) {
        $(e).removeClass('reverse');
        app._ocadPanelsClose();
      } else {
        $('.panel.visible').removeClass('visible').velocity({translateX:'-100%'},'fast');
        $('.year-item').velocity({ opacity: 0, translateX:'-20px', display: 'flex' },'fast').removeClass('loaded');
        $('.header-item').addClass('inactive').removeClass('reverse');
        app.settings.logo.addClass('invert');

        $(e).addClass('reverse').removeClass('inactive');
        $('.'+targetPanel).velocity({translateX:['-4%','-100%']},{duration: 200, easing:[0.175, 0.885, 0.32, 1.14]}).addClass('visible').attr('aria-hidden',false).focus();
        $('.illustrator-meta').velocity({opacity: .2},'fast');

        if (targetPanel === 'year-select') {
          $('.year-item').each(function(i){
            var item = $(this);
            item.delay(100*i).velocity({opacity:1, translateX:['0px','-40px'], transformdisplay:'flex'},{
              easing:[0.175, 0.885, 0.32, 1.24],
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
        app._ocadShuffle( document.querySelectorAll('.gallery-item') );
      }
      if ($(app.settings.masonryContainerHome).hasClass('illustrators-grid')) {
        $(app.settings.masonryContainerHome).imagesLoaded().done(function() {
            app._ocadMasonry(app.settings.masonryContainerHome);
          }
        );
      }
    },

    _ocadPanelsCloseFullImage: function() {
      app.settings.imageModal.velocity('fadeOut',{duration: 180});
      $('#full-image').velocity({translateY:'15px'},'fast');
    },

    _ocadPanelsClose: function () {
      $('.illustrator-meta').velocity({opacity: 1}, 'fast');
      $('.header-item').removeClass('reverse inactive');
      app.settings.imageModal.velocity('fadeOut',{duration: 180 });
      app.settings.logo.removeClass('invert');
      $(app.settings.masonryContainer).velocity({opacity:1},'fast');
      if ($('.panel').hasClass('visible')) {
        $('.panel.visible').removeClass('visible').attr('aria-hidden',true).blur().velocity({translateX:'-100%'}, 'fast');
        $('.year-item').velocity({ opacity: 0, translateX:'-40px', display: 'flex' },'fast').removeClass('loaded');
      }
    },

    _ocadPanelsCloseSelective: function(event) {
      if (!$(event.target).closest('#full-image').length && app.settings.imageModal.is(':visible')) {
        app.settings.imageModal.velocity('fadeOut',{duration:180});
        $(app.settings.masonryContainer).velocity({opacity:1},'fast');
        $('.illustrator-nav-single, .illustrator-meta-wrapper').removeClass('inactive');
      }

      if (!$(event.target).closest('.panel, .header-item').length && $('.panel').hasClass('visible')) {
        app._ocadPanelsClose();
      }
    },

    _ocadGalleryNav: function() {

      var galleryImages = [];
      var nextImage;
      var masonryItemAnchor = document.querySelectorAll('.gallery-icon-anchor');

      if ($('body').hasClass('single')) {

        $(app.settings.masonryContainer).imagesLoaded().done(function() {
          app._ocadMasonry(app.settings.masonryContainer);
          app._ocadCascade('.gallery-item',100);
        });

        for (var i = 0, items = masonryItemAnchor.length; i < items; i++) {
          $(masonryItemAnchor[i]).data('index',i);
          var imageElement = $(masonryItemAnchor[i]);
          var imageSet = {
            url: imageElement.attr('href'),
            srcset: imageElement.data('srcset'),
            sizes: imageElement.data('sizes'),
            width: imageElement.find('img').attr('width'),
            height: imageElement.find('img').attr('height')
          };
          galleryImages.push(imageSet);
        }

        // Miniviewer constructor

        var miniView = document.querySelector('.miniview');
        var miniViewItem = function(item){
          miniView.innerHTML += '<div class="mini-item"><canvas class="mini-item-inner" width="'+ item.width +'" height="'+ item.height +'"></canvas></div>';
        }
        galleryImages.map(miniViewItem);

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
      * Updates miniview to corresponding element
      **/

      var miniViewUpdate = function(item) {
        $('.mini-item-inner').removeClass('active');
        $('.mini-item-inner').eq(item).addClass('active');
      };

      /**
      * Masonry item click
      **/

      $(app.settings.masonryContainer).on( 'click', '.gallery-icon-anchor', function( event ) {
        event.preventDefault();
        app._ocadLoader(true);
        var itemImage = $(this);
        app.settings.imageIndex = itemImage.data('index');

        $('.image-modal-container').html(imageModalSetter(itemImage));

        $('#full-image').imagesLoaded().done(function(){
          app._ocadLoader(false);
          app.settings.imageModal.velocity('fadeIn', {
            duration: 180,
            begin: function() {
              $(app.settings.masonryContainer).velocity({opacity:0},'fast');
              $('.illustrator-nav-single, .illustrator-meta-wrapper').addClass('inactive');
              $('#full-image').velocity({translateY:'0'});
            },
            complete: function() {
              $('#full-image').velocity({opacity:1},'fast');
            }
          });
        });

        miniViewUpdate(app.settings.imageIndex);

      });

      /**
      * Handles progressing through the gallery
      **/

      function nextElement(direction) {
        app._ocadLoader(true);

        if (direction === 'reverse') {
          --app.settings.imageIndex;
        } else {
          ++app.settings.imageIndex;
        }

        if (app.settings.imageIndex === galleryImages.length) {
          app.settings.imageIndex = 0;
        }

        if (app.settings.imageIndex === -1) {
          app.settings.imageIndex = galleryImages.length - 1;
        }

        nextImage = galleryImages[app.settings.imageIndex];

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

        miniViewUpdate(app.settings.imageIndex);

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

})();
