/* eslint
no-unused-vars: ["error", { "varsIgnorePattern": "msnry" }],
no-underscore-dangle: ["off"]
*/
/* global Bricklayer */

const $ = require('jquery');
window.jQuery = window.$ = $;
require('./libs/modernizr-custom');
require('typeahead.js');
require('velocity-animate');
require('imagesloaded');
require('./libs/jquery-text-mix');
require('lazysizes');
require('bricklayer');
const FastClick = require('fastclick');
const Bloodhound = require('bloodhound');

(function () {
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
      searchLoader: $('.search-loader'),
      imageIndex: 0,
    },

    _fastClick: function () {
      FastClick(document.body);
    },

    _ocadTextScramblerMoments: function () {
      const thesis = $('.thesis-title');
      const illustrator = $('.illustrator-meta-name');
      const yearSelect = $('#year-select-link');
      const searchSelect = $('#search-link');
      const logo = $('.logo');
      const sectionIndicator = $('.section-indicator');
      const textMixer = (ele, originText, newText, duration) => {
        const t = $(ele);
        t.hover(() => {
          t.textMix(newText, duration, 'linear');
        }, () => {
          t.textMix(originText, duration, 'linear');
        });
      };
      textMixer(thesis, thesis.text(), `${thesis.text()} by ` + illustrator.text(), 500);
      textMixer(illustrator, illustrator.text(), `${illustrator.text()}, class of ${$('.year-item.active').text()}`, 500);
      textMixer(yearSelect, yearSelect.text(), 'Spanning 2009 to 2016', 500);
      textMixer(searchSelect, searchSelect.text(), 'Looking for someone?', 500);
      textMixer(logo, logo.text(), 'The Graduating Class of 2016', 500);
      textMixer(sectionIndicator, sectionIndicator.text(), `The Graduating Class of ${sectionIndicator.text()}`, 500);

      sectionIndicator.hover(() => {
        $('body').addClass('grid-focus');
        $(app.settings.masonryContainerHome).addClass('blur');
      }, () => {
        $('body').removeClass('grid-focus');
        $(app.settings.masonryContainerHome).removeClass('blur');
      });

      $('.home-grid').hover(() => {
        $('.title-unit-illustrator').toggleClass('active');
        $('.title-unit-init').toggleClass('active');
        $('body').addClass('grid-focus');
      }, () => {
        $('body').removeClass('grid-focus');
        $('.title-unit-init').toggleClass('active');
        $('.title-unit-illustrator').toggleClass('active');
      });

      $('.illustrators-grid .gallery-item').hover(ele => {
        const targetItem = $(ele.target).parentsUntil('.gallery-item');
        const illustrationTitle = targetItem.find('.illustrator-title').text();
        const illustrationAuthor = targetItem.find('.illustrator-name').text();
        app._ocadPanelsClose();
        if (illustrationTitle.length === 0) {
          $('.title-illustration').addClass('empty');
        } else {
          $('.title-illustration').removeClass('empty');
        }
        $('.title-illustration').textMix(illustrationTitle, 1000, 'linear');
        $('.title-author').textMix(illustrationAuthor, 1000, 'linear');
      }, () => {
        $('.title-illustration').textMix($('.title-illustration').text(), 1000, 'linear');
      });
    },

    _ocadLoader: (e = true) => {
      if (e === false) {
        $('body').removeAttr('style');
        app.settings.loader.velocity('fadeOut', 'fast');
      } else {
        $('body').css('cursor', 'progress');
        app.settings.loader.velocity('fadeIn', 'fast');
      }
    },

    _ocadMasonry: selector => {
      const msnry = new Bricklayer(document.querySelector(selector));
    },

    _ocadCascade: (selector, delayNum) => {
      const item = document.querySelectorAll(selector);
      const velocityComplete = ele => {
        $(ele).addClass('loaded');
      };

      for (var i = 0, items = item.length; i < items; i++) {
        $(item[i]).delay(delayNum * i).velocity({ opacity: 1 }, {
          complete: velocityComplete,
        });
      }
    },

    _ocadSearch: function () {
      const illustratorSearch = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          url: '/wp-json/wp/v2/illustrator?filter[s]=%QUERY',
          wildcard: '%QUERY',
        },
      });

      illustratorSearch.initialize();

      app.settings.searchField.typeahead({
        hint: false,
      }, {
        name: 'illustratorName',
        displayKey: item => {
          return item.title.rendered;
        },
        source: illustratorSearch,
        limit: 10,
      }).on('typeahead:select', ($e, resultsData) => {
        window.location.href = resultsData.link;
      }).on('typeahead:asyncrequest', () => {
        app.settings.searchLoader.velocity('stop').velocity('fadeIn', 'fast');
      }).on('typeahead:asyncreceive', () => {
        app.settings.searchLoader.velocity('stop').velocity('fadeOut', 'fast');
      });
    },

    _ocadPanelSelect: function (e) {
      const targetPanel = $(e).data('panel');

      if ($(e).hasClass('invert')) {
        $(e).removeClass('invert');
        app._ocadPanelsClose();
      } else {
        $('.panel.visible').removeClass('visible').velocity({ translateX: '-100%' }, 'fast');
        $('.year-item').velocity({ opacity: 0, translateX: '-20px', display: 'flex' }, 'fast').removeClass('loaded');
        $('.panel-colophon').velocity({ opacity: 0, translateX: ['-40px', '0px'] }, 'fast');

        $('.header-item').addClass('inactive').removeClass('invert');
        app.settings.logo.addClass('invert');

        $(e).addClass('invert').removeClass('inactive');
        $('.' + targetPanel).velocity({ translateX: ['-4%', '-100%'] }, { duration: 800, easing: [0.19, 1, 0.22, 1] }).addClass('visible').attr('aria-hidden', false).focus();
        $('.illustrator-meta').velocity({ opacity: 0.2 }, 'fast');

        if (targetPanel === 'year-select') {
          $('.year-item').each(function (i) {
            var item = $(this);
            item.delay(100 * i).velocity({ opacity: 1, translateX: ['0px', '-40px'], transformdisplay: 'flex' }, {
              easing: [0.175, 0.885, 0.32, 1.24],
              complete: function() {
                item.addClass('loaded');
                if (i === $('.year-item').length - 1) {
                  $('.panel-colophon').velocity({ translateX: ['0px', '-40px'], opacity: 0.5 }, { duration: 200, easing: [0.175, 0.885, 0.32, 1.14] });
                }
              }
            });
          });
        }
        if (targetPanel == 'search-container') {
          app.settings.searchField.focus();
        }
      }
    },

    _ocadPanelSelectButtons: function () {
      app._ocadSearch();
      $('.header-item').on('click', function () {
        app._ocadPanelSelect(this);
      });
    },

    _ocadShuffle: function (elems) {
      var allElems = (function() {
        var ret = [], l = elems.length;
        while (l--) { ret[ret.length] = elems[l]; }
        return ret;
      })();
      var shuffled = (function() {
        var l = allElems.length, ret = [];
        while (l--) {
          var random = Math.floor(Math.random() * allElems.length),
            randEl = allElems[random].cloneNode(true);
          allElems.splice(random, 1);
          ret[ret.length] = randEl;
        }
          return ret;
        })(),
        l = elems.length;

      while (l--) {
        elems[l].parentNode.insertBefore(shuffled[l], elems[l].nextSibling);
        elems[l].parentNode.removeChild(elems[l]);
      }
    },

    _ocadHomeLoader: function () {
      if ($('body').hasClass('home')) {
        app._ocadShuffle(document.querySelectorAll('.gallery-item'));
      }
      if ($(app.settings.masonryContainerHome).hasClass('illustrators-grid')) {
        app._ocadMasonry(app.settings.masonryContainerHome);
      }
    },

    _ocadPanelsCloseFullImage: function() {
      app.settings.imageModal.velocity('fadeOut', { duration: 180 });
      $('#full-image').velocity({ translateY: '15px' }, 'fast');
    },

    _ocadPanelsClose: function () {
      $('.illustrator-meta').velocity({ opacity: 1 }, 'fast');
      $('.header-item').removeClass('invert inactive');
      app.settings.imageModal.velocity('fadeOut', { duration: 180 });
      app.settings.logo.removeClass('invert');
      $(app.settings.masonryContainer).velocity({ opacity: 1 }, 'fast');
      if ($('.panel').hasClass('visible')) {
        $('.panel.visible').removeClass('visible').attr('aria-hidden', true).blur().velocity({ translateX: '-100%' }, 'fast');
        $('.year-item').velocity({ opacity: 0, translateX: '-40px', display: 'flex' }, 'fast').removeClass('loaded');
        $('.panel-colophon').velocity({ opacity: 0, translateX: ['-40px', '0px'] }, 'fast');
      }
    },

    _ocadPanelsCloseSelective: function(event) {
      if (!$(event.target).closest('#full-image, .miniview').length && app.settings.imageModal.is(':visible')) {
        app.settings.imageModal.velocity('fadeOut', { duration: 180 });
        $(app.settings.masonryContainer).velocity({ opacity: 1 }, 'fast');
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
          const imageElement = $(masonryItemAnchor[i]);
          const imageSet = {
            index: i,
            url: imageElement.attr('href'),
            srcset: imageElement.data('srcset'),
            sizes: imageElement.data('sizes'),
            width: imageElement.find('img').attr('width'),
            height: imageElement.find('img').attr('height'),
          };
          galleryImages.push(imageSet);
        }

        // Miniviewer constructor

        const miniView = document.querySelector('.miniview');
        const miniViewItem = item => {
          miniView.innerHTML += '<div class="mini-item" data-index="'+ item.index +'"><canvas class="mini-item-inner" width="'+ item.width +'" height="'+ item.height +'"></canvas></div>';
        };
        galleryImages.map(miniViewItem);
      }

      /**
      * Updates miniview to corresponding element
      **/

      const miniViewUpdate = item => {
        $('.mini-item-inner').removeClass('active');
        $('.mini-item-inner').eq(item).addClass('active');
      };

      /**
      * Click event for miniview navigation
      **/

      $('.miniview').on('click', '.mini-item', function () {
        app._ocadLoader();
        app.settings.imageIndex = $(this).data('index');
        miniViewUpdate(app.settings.imageIndex);
        modalImageChanger();
      });

      /**
      * Creates initial image element
      **/

      const imageModalSetter = imageSource => {
        const image = new Image();
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

      $(app.settings.masonryContainer).on('click', '.gallery-icon-anchor', function (event) {
        event.preventDefault();
        app._ocadLoader();
        const itemImage = $(this);
        app.settings.imageIndex = itemImage.data('index');

        $('.image-modal-container').html(imageModalSetter(itemImage));

        $('#full-image').imagesLoaded().done(() => {
          app._ocadLoader(false);
          app.settings.imageModal.velocity('fadeIn', {
            duration: 180,
            begin: () => {
              $(app.settings.masonryContainer).velocity({ opacity: 0 }, 'fast');
              $('#full-image').velocity({ translateY: [0, 10] }, [0.175, 0.885, 0.32, 1.275]);
            },
            complete: () => {
              $('#full-image').velocity({ opacity: 1 });
            },
          });
        });

        miniViewUpdate(app.settings.imageIndex);
      });

      /**
      * Modal image changer
      **/

      const modalImageChanger = (imageItem = galleryImages[app.settings.imageIndex]) => {
        $.Velocity.animate($('#full-image'), { opacity: 0, translateY: '-10px' }, [0.175, 0.885, 0.32, 1.275])
        .then(() => {
          const image = document.getElementById('full-image');
          image.src = imageItem.url;
          image.srcset = imageItem.srcset;
          image.sizes = imageItem.sizes;

          image.onload = () => {
            app._ocadLoader(false);
            $('#full-image').velocity({ opacity: 1, translateY: [0, '10px'] }, [0.175, 0.885, 0.32, 1.275]);
          };
        });
      };

      /**
      * Handles progressing through the gallery
      **/

      const nextElement = direction => {
        app._ocadLoader();

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

        modalImageChanger(nextImage);
        miniViewUpdate(app.settings.imageIndex);
      };

      /**
      * Click event for cycling through images
      **/

      $('.image-modal-container').on('click', 'img', () => {
        nextElement();
      });

      /**
      * Keyboard event for cycling through images
      **/

      $(document).keydown(e => {
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
      $(document).on('click', app._ocadPanelsCloseSelective).keydown(function (e) {

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
    },
  };

  /**
  * Window load ready
  **/

  $(window).load(() => {
    app._ocadLoader(false);
  });

  /**
  * Initialize
  **/

  app.init();
})();
