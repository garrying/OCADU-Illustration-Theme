/* eslint
no-underscore-dangle: ["off"]
*/

import '../styles/main.scss';

const $ = require('jquery');

window.jQuery = window.$ = $;
require('./libs/jquery.autocomplete.min');
require('velocity-animate');
require('imagesloaded');
require('lazysizes');
const ColorThief = require('./libs/color-thief');
const Bricklayer = require('bricklayer');
const fastClick = require('fastclick');

(() => {
  const app = {
    init: () => {
      app._fastClick();
      app._ocadPanelSelectButtons();
      app._ocadHomeLoader();
      app._ocadGalleryNav();
      app._ocadUIbinding();
      app._ocadGridFocus();
      app._ocadImgHover();
    },

    settings: {
      documentBody: $('body'),
      contentContainer: $('#main'),
      logo: $('.logo'),
      loader: $('.loader'),
      masonryContainer: '#pack-content',
      masonryContainerHome: '#illustrators',
      nextItem: $('.nav-next a'),
      prevItem: $('.nav-previous a'),
      searchField: $('#autocomplete'),
      imageModal: $('#image-modal'),
      searchLoader: $('.search-loader'),
      imageIndex: 0,
      easeOutBack: [0.175, 0.885, 0.32, 1.275],
    },

    _fastClick: () => {
      fastClick.attach(document.body);
    },

    _colorSample: (imageItem) => {
      const colorThief = new ColorThief();
      return colorThief.getColor(imageItem);
    },

    _ocadImgHover: () => {
      if ($('.grid').length) {
        $('.grid img').on('mouseenter', (e) => {
          const domColor = app._colorSample(e.target);
          const rgb = `rgb(${domColor[0]}, ${domColor[1]}, ${domColor[2]})`;
          $('body').css('background', rgb);
        });
      }
    },

    _ocadGridFocus: () => {
      $('.section-indicator').hover(() => {
        app.settings.documentBody.addClass('grid-focus');
        $(app.settings.masonryContainerHome).addClass('blur');
      }, () => {
        app.settings.documentBody.removeClass('grid-focus');
        $(app.settings.masonryContainerHome).removeClass('blur');
      });

      $('.home-grid').hover(() => {
        $('.title-unit-illustrator').addClass('active');
        $('.title-unit-init').removeClass('active');
        app.settings.documentBody.addClass('grid-focus');
      }, () => {
        app.settings.documentBody.removeClass('grid-focus');
        $('.title-unit-init').addClass('active');
        $('.title-unit-illustrator').removeClass('active');
      });
    },

    _ocadLoader: (e = true) => {
      if (e === false) {
        app.settings.documentBody.removeAttr('style');
        app.settings.loader.velocity('stop').velocity('fadeOut', 'fast');
      } else {
        app.settings.documentBody.css('cursor', 'progress');
        app.settings.loader.velocity('stop').velocity('fadeIn', 'fast');
      }
    },

    _ocadMasonry: selector => new Bricklayer(document.querySelector(selector)),

    _ocadCascade: (selector, delayNum) => {
      let i = 0;
      const items = document.querySelectorAll(selector);
      const velocityComplete = (ele) => {
        $(ele).addClass('loaded');
      };

      Array.from(items).forEach((item) => {
        $(item).delay(delayNum * i).velocity({ opacity: 1 }, {
          complete: velocityComplete,
        });
        i += 1;
      });
    },

    _ocadSearch: () => {
      app.settings.searchField.autocomplete({
        serviceUrl: '/wp-json/wp/v2/illustrator',
        paramName: 'search',
        lookupLimit: 10,
        appendTo: '.search-wrapper',
        showNoSuggestionNotice: true,
        onSearchStart: () => {
          app.settings.searchLoader.velocity('stop').velocity('fadeIn', 'fast');
        },
        onSearchComplete: () => {
          app.settings.searchLoader.velocity('stop').velocity('fadeOut', 'fast');
        },
        transformResult: response => ({
          suggestions: $.map($.parseJSON(response), item => ({
            value: item.title.rendered,
            data: item.link,
          })),
        }),
        onSelect: (suggestion) => {
          window.location.href = suggestion.data;
        },
      });
    },

    _ocadPanelSelect: (e) => {
      const targetPanel = $(e).data('panel');

      if ($(e).hasClass('invert')) {
        $(e).removeClass('invert');
        app._ocadPanelsClose();
      } else {
        $('.panel.visible').removeClass('visible').velocity({ translateX: '-100%' }, 'fast')
          .attr('aria-hidden', true);
        $('.year-item').velocity(
          { opacity: 0, display: 'flex' }, 'fast').removeClass('loaded');

        $('.header-item').addClass('inactive').removeClass('invert');
        app.settings.logo.addClass('invert');

        $(e).addClass('invert').removeClass('inactive');
        $(`.${targetPanel}`).velocity(
          { translateX: ['-4%', '-100%'] },
          { duration: 800, easing: [0.19, 1, 0.22, 1] },
        ).addClass('visible').attr('aria-hidden', false)
        .focus();
        app.settings.contentContainer.velocity({ opacity: 0.2 }, 'fast');

        if (targetPanel === 'year-select') {
          $('.year-item').each((index, ele) => {
            const item = $(ele);
            item.delay(100 * index).velocity(
              { opacity: 1, transformdisplay: 'flex' },
            );
          });
        }
        if (targetPanel === 'search-container') {
          app.settings.searchField.focus();
        }
      }
    },

    _ocadPanelSelectButtons: () => {
      app._ocadSearch();
      $('.header-item').on('click', (ele) => {
        app._ocadPanelSelect(ele.target);
      });
    },

    _ocadShuffle: (elems, gridTarget) => {
      $(elems).sort(() => Math.random() - 0.5).prependTo($(gridTarget));
    },

    _ocadHomeLoader: () => {
      if (app.settings.documentBody.hasClass('home')) {
        app._ocadShuffle(document.querySelectorAll('.gallery-item'), '.home-grid');
      }
      if ($(app.settings.masonryContainerHome).hasClass('illustrators-grid')) {
        app._ocadMasonry(app.settings.masonryContainerHome);
      }
    },

    _ocadPanelsCloseFullImage: () => {
      app.settings.imageModal.velocity('fadeOut', { duration: 180 });
      $('#full-image').velocity({ translateY: '15px' }, 'fast');
    },

    _ocadPanelsClose: () => {
      app.settings.contentContainer.velocity({ opacity: 1 }, 'fast');
      $('.header-item').removeClass('invert inactive');
      app.settings.imageModal.velocity('fadeOut', { duration: 180 });
      app.settings.logo.removeClass('invert');
      $(app.settings.masonryContainer).velocity({ opacity: 1 }, 'fast');
      $('.panel.velocity-animating').velocity('stop').velocity({ translateX: '-100%' }, 'fast');
      $('.panel').removeClass('visible').attr('aria-hidden', true).blur()
        .velocity({ translateX: '-100%' }, 'fast');
      $('.year-item').velocity({ opacity: 0, display: 'flex' }, 'fast')
        .removeClass('loaded');
    },

    _ocadPanelsCloseSelective: (event) => {
      if (!$(event.target).closest('#full-image, .miniview').length
        && app.settings.imageModal.is(':visible')) {
        app.settings.imageModal.velocity('fadeOut', { duration: 180 });
        $(app.settings.masonryContainer).velocity({ opacity: 1 }, 'fast');
        $('.illustrator-nav-single, .illustrator-meta-wrapper').removeClass('inactive');
      }

      if (!$(event.target).closest('.panel, .header-item').length
        && $('.panel').hasClass('visible')) {
        $('.panel').attr('aria-hidden', true);
        app._ocadPanelsClose();
      }
    },

    _ocadGalleryNav: () => {
      const galleryImages = [];
      let nextImage;
      const masonryItemAnchor = document.querySelectorAll('.gallery-icon-anchor');

      if (app.settings.documentBody.hasClass('single')) {
        $(app.settings.masonryContainer).imagesLoaded().done(() => {
          app._ocadMasonry(app.settings.masonryContainer);
          app._ocadCascade('.gallery-item', 100);
        });

        for (let i = 0, items = masonryItemAnchor.length; i < items; i += 1) {
          $(masonryItemAnchor[i]).data('index', i);
          const imageElement = $(masonryItemAnchor[i]);
          const imageSet = {
            index: i,
            url: imageElement.data('src-large'),
            srcset: imageElement.data('srcset'),
            sizes: imageElement.data('sizes'),
            width: imageElement.find('img').attr('width'),
            height: imageElement.find('img').attr('height'),
            caption: imageElement.data('caption'),
          };
          galleryImages.push(imageSet);
        }

        // Miniviewer constructor

        const miniView = document.querySelector('.miniview');
        const miniViewItem = (item) => {
          miniView.innerHTML += `
            <a href="#" class="mini-item">
              <canvas data-index="${item.index}" class="mini-item-inner"
              width="${item.width}" height="${item.height}">
              </canvas>
            </a>`;
        };
        galleryImages.map(miniViewItem);
      }

      /**
      * Updates miniview to corresponding element
      **/

      const miniViewUpdate = (item) => {
        $('.mini-item-inner').removeClass('active');
        $('.mini-item-inner').eq(item).addClass('active');
      };

      /**
      * Creates initial image element
      **/

      const imageModalSetter = (imageSource) => {
        const image = new Image();
        image.alt = 'Full sized illustration';
        image.id = 'full-image';
        image.className = 'image-modal-container-full-image';
        image.src = imageSource.data('src-large');
        image.srcset = imageSource.data('srcset');
        image.sizes = imageSource.data('sizes');
        return image;
      };

      /**
      * Displays relevant caption
      **/

      const imageCaptionSetter = (imageCaption) => {
        const imageCaptionContainer = $('.image-modal-caption');
        if (imageCaption) {
          imageCaptionContainer.html(imageCaption);
          imageCaptionContainer.velocity({ opacity: 1 });
        } else {
          $.Velocity.animate(
            imageCaptionContainer,
            { opacity: 0 },
            'fast',
          ).then(() => {
            imageCaptionContainer.html('');
          });
        }
      };

      /**
      * Masonry item click
      **/

      $(app.settings.masonryContainer).on('click', '.gallery-icon-anchor', (event) => {
        event.preventDefault();
        app._ocadLoader();
        const itemImage = $(event.currentTarget);
        app.settings.imageIndex = itemImage.data('index');

        $('.image-modal-image').html(imageModalSetter(itemImage));

        $('#full-image').imagesLoaded().done(() => {
          app._ocadLoader(false);
          app.settings.imageModal.velocity('fadeIn', {
            duration: 180,
            begin: () => {
              $(app.settings.masonryContainer).velocity({ opacity: 0 }, 'fast');
              $('#full-image').velocity({ translateY: [0, 5] }, app.settings.easeOutBack);
            },
            complete: () => {
              imageCaptionSetter(itemImage.data('caption'));
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
        imageCaptionSetter(imageItem.caption);
        $.Velocity.animate(
          $('#full-image'),
          { opacity: 0, scale: 0.99 },
          app.settings.easeOutBack,
        ).then(() => {
          $('#full-image').velocity('stop');
          const image = document.getElementById('full-image');
          image.src = imageItem.url;
          image.srcset = imageItem.srcset;
          image.sizes = imageItem.sizes;
          image.onload = () => {
            app._ocadLoader(false);
            $('#full-image').velocity(
              { opacity: 1, scale: 1 },
              app.settings.easeOutBack,
            );
          };
        });
      };

      /**
      * Click event for miniview navigation
      **/

      $('.miniview').on('click', '.mini-item', (ele) => {
        app._ocadLoader();
        app.settings.imageIndex = $(ele.target).data('index');
        miniViewUpdate(app.settings.imageIndex);
        modalImageChanger();
      });

      /**
      * Handles progressing through the gallery
      **/

      const nextElement = (direction) => {
        app._ocadLoader();

        if (direction === 'reverse') {
          app.settings.imageIndex -= 1;
        } else {
          app.settings.imageIndex += 1;
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

      $(document).keydown((e) => {
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

    _ocadUIbinding: () => {
      $('.close-panel').on('click', app._ocadPanelsClose);
      $(document).on('click', app._ocadPanelsCloseSelective).keydown((e) => {
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

  $(window).on('load', () => {
    app._ocadLoader(false);
  });

  /**
  * Initialize
  **/

  app.init();
})();
