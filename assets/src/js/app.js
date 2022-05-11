import '../styles/main.scss'
import autoComplete from '@tarekraafat/autocomplete.js'
import * as blobs2 from './libs/blobs'
import * as lazySizes from 'lazysizes'
import Colcade from 'colcade'
import SwipeListener from 'swipe-listener'
import $ from 'jquery/dist/jquery.slim.min'
import Velocity from 'velocity-animate/velocity.min'

Velocity.patch($ && $.fn)

Velocity('registerSequence', 'fadeOut', {
  duration: 1000,
  '0%': {
    opacity: '1'
  },
  '100%': {
    opacity: '0'
  }
})

Velocity('registerSequence', 'fadeIn', {
  duration: 1000,
  '0%': {
    opacity: '0'
  },
  '100%': {
    opacity: '1'
  }
});

(() => {
  const app = {
    init: () => {
      app._ocadPanelSelectButtons()
      app._ocadHomeLoader()
      app._ocadHomeHover()
      app._ocadGalleryNav()
      app._ocadUIbinding()
      app._ocadSingleScroll()
      app._ocadSearch()
      app._blob()
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
      imageModal: $('#image-modal'),
      searchLoader: $('.search-loader'),
      singleWrapper: $('.illustrator-nav-single-wrapper'),
      headerInner: $('.heading-inner'),
      imageIndex: 0,
      easeOutBack: [0.175, 0.885, 0.32, 1.275]
    },

    _ocadSingleScroll: () => {
      let knownPosition = 0
      let ticking = false

      function doSomething (scrollPos, knownPosition) {
        if (scrollPos > knownPosition) {
          app.settings.headerInner.addClass('fade-out')
        } else {
          app.settings.headerInner.removeClass('fade-out')
        }

        if (scrollPos > 20) {
          app.settings.singleWrapper.addClass('fade-out')
        } else {
          app.settings.singleWrapper.removeClass('fade-out')
        }
      }

      window.addEventListener('scroll', function (e) {
        const st = window.pageYOffset || document.documentElement.scrollTop
        if (!ticking) {
          window.requestAnimationFrame(() => {
            doSomething(st, knownPosition)
            ticking = false
            knownPosition = st <= 0 ? 0 : st
          })
          ticking = true
        }
      }, { passive: true })
    },

    _ocadLoader: (e = true) => {
      if (e === false) {
        app.settings.documentBody.removeAttr('style')
        app.settings.loader.velocity('stop').velocity('fadeOut', { duration: 'fast' })
      } else {
        app.settings.documentBody.css('cursor', 'progress')
        app.settings.loader.velocity('stop').velocity('fadeIn', { duration: 'fast' })
      }
    },

    _ocadMasonry: selector => new Colcade(document.querySelector(selector), {
      columns: '.grid-col',
      items: '.gallery-item'
    }),

    _ocadSearch: () => {
      const autoCompleteJS = new autoComplete({ // eslint-disable-line
        submit: true,
        data: {
          src: async (query) => {
            try {
              const source = await window.fetch(`/wp-json/wp/v2/illustrator?&search=${query}`)
              const data = await source.json()
              return data.map((item) => ({
                title: item.title.rendered,
                link: item.link
              }))
            } catch (error) {
              return error
            }
          },
          keys: ['title'],
          cache: false
        },
        selector: '#autocomplete',
        threshold: 2,
        debounce: 300,
        resultsList: {
          class: 'autoComplete_list',
          maxResults: 5,
          element: (list, data) => {
            if (!data.results.length) {
              const message = document.createElement('div')
              message.setAttribute('class', 'no_result')
              message.innerHTML = `<span>Found no results for ${data.query}</span>`
              list.prepend(message)
            }
          },
          noResults: true
        },
        resultItem: {
          class: 'autoComplete_result',
          highlight: 'autoComplete_highlighted',
          selected: 'autoComplete_selected'
        }
      })

      document.querySelector('#autocomplete').addEventListener('selection', (event) => {
        window.location.href = event.detail.selection.value.link
      })
    },

    _ocadPanelSelect: (e) => {
      const targetPanel = $(e).data('panel')

      if ($(e).hasClass('invert')) {
        $(e).removeClass('invert')
        app._ocadPanelsClose()
      } else {
        $('.panel.visible').removeClass('visible').velocity('fadeOut', {
          complete: (e) => {
            $(e).addClass('hidden').attr('aria-hidden', true)
          },
          duration: 'fast'
        })
        $('.year-item').velocity('stop')

        $('.header-item').addClass('inactive').removeClass('invert')
        app.settings.logo.addClass('invert')

        $(e).addClass('invert').removeClass('inactive')
        $(`.${targetPanel}`).velocity(
          'fadeIn', {
            begin: (e) => {
              $(e).addClass('visible').attr('aria-hidden', false).focus().velocity({ display: 'flex' })
            },
            duration: 200
          })
        $('html, body').addClass('lock-scroll')

        if (targetPanel === 'year-select') {
          $('.year-item').velocity({
            opacity: 1,
            transformdisplay: 'flex'
          }, {
            stagger: 100,
            duration: 1000
          })
        }
      }
    },

    _ocadPanelSelectButtons: () => {
      $('.header-item').on('click', (ele) => {
        $('.panel.velocity-animating').velocity('stop').velocity('fadeOut', { duration: 'fast' })
        app._ocadPanelSelect(ele.target)
      })
    },

    _ocadShuffle: (elems) => {
      const elements = $(elems).sort(() => Math.random() - 0.5)
      const colc = new Colcade(document.querySelector(app.settings.masonryContainerHome), {
        columns: '.grid-col',
        items: '.gallery-item'
      })
      colc.append(elements)
    },

    _ocadHomeLoader: () => {
      if ($(app.settings.masonryContainerHome).hasClass('illustrators-grid')) {
        window.onload = () => {
          if (app.settings.documentBody.hasClass('home')) {
            app._ocadShuffle(document.querySelectorAll('.gallery-item'))
          } else {
            app._ocadMasonry(app.settings.masonryContainerHome)
          }
          $(app.settings.masonryContainerHome).addClass('ready')
          lazySizes.autoSizer.checkElems()
        }
      }
    },

    _ocadHomeHover: () => {
      if (app.settings.documentBody.hasClass('home')) {
        $('.illustrator-link').on('mouseenter', (ele) => {
          let y = ele.clientY
          let x = ele.clientX
          $(ele.currentTarget).find('.illustrator-meta-container').addClass('active')

          window.requestAnimationFrame(function animation () {
            $(ele.currentTarget).mousemove((e) => {
              y = e.clientY + 5
              x = e.clientX + 5
            })
            $(ele.currentTarget).find('.illustrator-meta-container').css({ transform: `translate(${x}px, ${y}px)` })
            window.requestAnimationFrame(animation)
          })
        })

        $('.illustrator-link').on('mouseleave', (ele) => {
          $(ele.currentTarget).find('.illustrator-meta-container').removeClass('active')
        })
      }
    },

    _ocadPanelsClose: () => {
      $('html, body').removeClass('lock-scroll')

      $('.header-item').removeClass('invert inactive')
      app.settings.imageModal.velocity('fadeOut', { complete: (e) => { $(e).addClass('hidden') }, duration: 180 })
      app.settings.logo.removeClass('invert')
      $('.panel.velocity-animating').velocity('stop')
      $('.panel.visible').attr('aria-hidden', true).blur().velocity('stop')
        .velocity('fadeOut', {
          duration: 'fast',
          complete: (e) => {
            $(e).removeClass('visible')
          }
        })
      $('.year-item').velocity({ opacity: 0, display: 'flex' }, { duration: 'fast' })
    },

    _ocadPanelsCloseSelective: (event) => {
      if (!$(event.target).closest('#full-image, .miniview').length &&
        app.settings.imageModal.is(':visible')) {
        app.settings.imageModal.velocity('fadeOut', {
          complete: (e) => {
            $(e).addClass('hidden')
          },
          duration: 180
        })
        $('.illustrator-nav-single, .illustrator-meta-wrapper').removeClass('inactive')
        $('html, body').removeClass('lock-scroll')
      }

      if (!$(event.target).closest('.panel, .header-item').length &&
        $('.panel').hasClass('visible')) {
        $('.panel').attr('aria-hidden', true)
        app._ocadPanelsClose()
      }
    },

    _ocadGalleryNav: () => {
      const galleryImages = []
      let nextImage
      let itemImage
      const masonryItemAnchor = [...document.querySelectorAll('.gallery-icon-anchor')]

      if (app.settings.documentBody.hasClass('single')) {
        const galleryItems = (ele, i) => {
          ele.dataset.index = i
          const imageElement = $(ele)
          const imageSet = {
            index: i,
            url: imageElement.data('src-large'),
            srcset: imageElement.data('srcset'),
            sizes: imageElement.data('sizes'),
            width: imageElement.find('img').attr('width'),
            height: imageElement.find('img').attr('height'),
            caption: imageElement.data('caption')
          }
          galleryImages.push(imageSet)
        }

        masonryItemAnchor.map(galleryItems)

        // Miniviewer constructor

        const miniView = document.querySelector('.miniview')
        const miniViewItem = (item) => {
          miniView.innerHTML += `
            <a href="#" class="mini-item">
              <canvas data-index="${item.index}" class="mini-item-inner"
              width="${item.width}" height="${item.height}">
              </canvas>
            </a>`
        }
        app._ocadMasonry('#pack-content')
        galleryImages.map(miniViewItem)
      }

      /*
        Updates miniview to corresponding element
      */

      const miniViewUpdate = (item) => {
        $('.mini-item-inner').removeClass('active')
        $('.mini-item-inner').eq(item).addClass('active')
      }

      /*
        Creates initial image element
      */

      const imageModalSetter = (imageSource) => {
        const image = new window.Image()
        image.alt = 'Full sized illustration'
        image.id = 'full-image'
        image.className = 'image-modal-container-full-image lazyload'
        image.dataset.src = imageSource.data('src-large')
        if (image.dataset.src.split('.').pop() !== 'gif') {
          image.sizes = imageSource.data('sizes')
          image.dataset.srcset = imageSource.data('srcset')
        }
        return image
      }

      /*
        Displays relevant caption
      */

      const imageCaptionSetter = (imageCaption) => {
        const imageCaptionContainer = $('.image-modal-caption')
        if (imageCaption) {
          imageCaptionContainer.html(imageCaption)
          imageCaptionContainer.removeClass('hidden')
        } else {
          imageCaptionContainer.addClass('hidden')
          imageCaptionContainer.html('')
        }
      }

      /*
        Masonry item click
      */

      $(app.settings.masonryContainer).on('click', '.gallery-icon-anchor', (event) => {
        event.preventDefault()
        app._ocadLoader()
        itemImage = $(event.currentTarget)
        app.settings.imageIndex = itemImage.data('index')
        $('.image-modal-image').html(imageModalSetter(itemImage))
        lazySizes.loader.unveil(document.querySelector('#full-image'))
        miniViewUpdate(app.settings.imageIndex)
      })

      const modalReviel = () => {
        app._ocadLoader(false)
        app.settings.imageModal.velocity('fadeIn', {
          duration: 180,
          begin: (e) => {
            $(e).removeClass('hidden')
          },
          complete: () => {
            imageCaptionSetter(itemImage.data('caption'))
            $('#full-image').velocity({ opacity: 1 })
            $('html, body').addClass('lock-scroll')
          }
        })
      }

      /*
        Modal image changer
      */

      const modalImageChanger = (imageItem = galleryImages[app.settings.imageIndex]) => {
        Velocity(
          $('#full-image'),
          { opacity: 0 },
          app.settings.easeOutBack
        ).then(() => {
          $('#full-image').velocity('stop')
          const image = document.getElementById('full-image')
          if (!imageItem.srcset) {
            image.removeAttribute('srcset')
          }
          image.dataset.src = imageItem.url
          if (image.dataset.src.split('.').pop() !== 'gif') {
            image.dataset.srcset = imageItem.srcset
            image.dataset.sizes = imageItem.sizes
          } else {
            delete image.dataset.srcset
            image.removeAttribute('srcset')
          }
          lazySizes.loader.unveil(image)
          image.onload = () => {
            imageCaptionSetter(imageItem.caption)
            app._ocadLoader(false)
            $('#full-image').velocity(
              { opacity: 1 },
              app.settings.easeOutBack
            )
          }
        })
      }

      /*
        Click event for miniview navigation
      */

      $('.miniview').on('click', '.mini-item', (ele) => {
        app._ocadLoader()
        app.settings.imageIndex = $(ele.target).data('index')
        miniViewUpdate(app.settings.imageIndex)
        modalImageChanger()
      })

      /*
        Handles progressing through the gallery
      */

      const nextElement = (direction) => {
        app._ocadLoader()

        if (direction === 'reverse') {
          app.settings.imageIndex -= 1
        } else {
          app.settings.imageIndex += 1
        }

        if (app.settings.imageIndex === galleryImages.length) {
          app.settings.imageIndex = 0
        }

        if (app.settings.imageIndex === -1) {
          app.settings.imageIndex = galleryImages.length - 1
        }

        nextImage = galleryImages[app.settings.imageIndex]

        modalImageChanger(nextImage)
        miniViewUpdate(app.settings.imageIndex)
      }

      /*
        Click event for cycling through images
      */

      $('.image-modal-container').on('click', 'img', () => {
        nextElement()
      })

      /*
        Lazyload events
      */

      document.addEventListener('lazybeforeunveil', (e) => {
        if ($(e.target).is('#full-image') && !$(e.target).hasClass('lazyloaded')) {
          modalReviel()
        }
      })

      /*
        Keyboard event for cycling through images
      */

      document.addEventListener('keydown', (e) => {
        if (app.settings.imageModal.is(':visible')) {
          if (e.keyCode === 39) {
            nextElement()
          }
          if (e.keyCode === 37) {
            nextElement('reverse')
          }
        }
      })

      /*
        Swipe events
      */

      const lightbox = document.querySelector('.image-modal-wrapper')
      if (lightbox) {
        SwipeListener(lightbox)

        lightbox.addEventListener('swipe', function (e) {
          if (e.detail.directions.left) {
            nextElement()
          }
          if (e.detail.directions.right) {
            nextElement('reverse')
          }
        })
      }
    },

    _ocadUIbinding: () => {
      $('.close-panel').on('click', app._ocadPanelsClose)
      $(document).on('click', app._ocadPanelsCloseSelective).keydown((e) => {
        if (e.keyCode === 27) {
          app._ocadPanelsClose()
        }

        if (!app.settings.imageModal.is(':visible')) {
          if (e.keyCode === 37 && app.settings.prevItem.length) {
            window.location = app.settings.prevItem.attr('href')
          } else if (e.keyCode === 39 && app.settings.nextItem.length) {
            window.location = app.settings.nextItem.attr('href')
          }
        }
      })
    },

    _blob: () => {
      const svgString = blobs2.svg({
        seed: Math.random(),
        extraPoints: 8,
        randomness: 4,
        size: 400
      }, {
        fill: 'rgb(255,87,34)',
        strokeWidth: 1
      })
      if (document.querySelector('#error-blob-container')) {
        document.querySelector('#error-blob-container').innerHTML = svgString
      }
      if (!app.settings.documentBody.hasClass('single')) {
        $('link[rel="shortcut icon"]').attr('href', `data:image/svg+xml,${svgString}`)
      }
    }
  }

  /*
    Window load ready
  */

  $(window).on('load', () => {
    app._ocadLoader(false)
  })

  /*
    Initialize
  */

  app.init()
})()
