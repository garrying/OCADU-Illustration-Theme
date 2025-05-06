import * as AutoComplete from '@tarekraafat/autocomplete.js'
import $ from 'cash-dom'
import Colcade from 'colcade'
import * as lazySizes from 'lazysizes'
import { animate, stagger } from 'motion'
import SwipeListener from 'swipe-listener'
import '../styles/main.scss'
;(() => {
  const app = {
    init: () => {
      app._ocadPanelSelectButtons()
      app._ocadHomeLoader()
      app._ocadGalleryNav()
      app._ocadUIbinding()
      app._ocadSingleScroll()
      app._ocadSearch()
    },

    settings: {
      documentBody: $('body'),
      loader: $('.loader'),
      masonryContainer: '#pack-content',
      masonryContainerHome: '#illustrators',
      nextItem: $('.nav-next a'),
      prevItem: $('.nav-previous a'),
      imageModal: $('#image-modal'),
      singleWrapper: $('.illustrator-nav-single-wrapper'),
      headerInner: $('.heading-inner'),
      imageIndex: 0
    },

    _ocadSingleScroll: () => {
      let knownPosition = 0
      let ticking = false

      function doSomething(scrollPos, knownPosition) {
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

      window.addEventListener(
        'scroll',
        () => {
          const st = window.pageYOffset || document.documentElement.scrollTop
          if (!ticking) {
            window.requestAnimationFrame(() => {
              doSomething(st, knownPosition)
              ticking = false
              knownPosition = st <= 0 ? 0 : st
            })
            ticking = true
          }
        },
        { passive: true }
      )
    },

    _ocadLoader: (e = true) => {
      if (e === false) {
        app.settings.documentBody.removeAttr('style')
        app.settings.loader.hide()
      } else {
        app.settings.documentBody.css('cursor', 'progress')
        app.settings.loader.show()
      }
    },

    _ocadMasonry: (selector) =>
      new Colcade(document.querySelector(selector), {
        columns: '.grid-col',
        items: '.gallery-item'
      }),

    _ocadSearch: () => {
      const autoCompleteJS = new AutoComplete({
        submit: false,
        data: {
          src: async (query) => {
            try {
              const source = await window.fetch(
                `/wp-json/wp/v2/illustrator?&search=${query}`
              )
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
          selected: 'autoComplete_selected',
          submit: true
        },
        events: {
          input: {
            focus: () => {
              autoCompleteJS.open()
            }
          }
        }
      })

      document
        .querySelector('#autocomplete')
        .addEventListener('selection', (event) => {
          window.location.href = event.detail.selection.value.link
        })
    },

    _ocadPanelSelect: (e) => {
      const targetPanel = $(e).data('panel')

      if ($(e).hasClass('invert')) {
        $(e).removeClass('invert')
        app._ocadPanelsClose()
      } else {
        $('.header-item').addClass('inactive').removeClass('invert')

        $(e).addClass('invert').removeClass('inactive')

        $(`.${targetPanel}`)
          .addClass('visible')
          .attr('aria-hidden', false)
          .css({ display: 'flex' })

        animate(`.${targetPanel}`, { opacity: [0, 1] })

        $('html, body').addClass('lock-scroll')

        if (targetPanel === 'year-select') {
          animate('.year-item', { opacity: 1 }, { delay: stagger(0.1) })
        }
      }
    },

    _ocadPanelSelectButtons: () => {
      $('.header-item').on('click', (ele) => {
        app._ocadPanelSelect(ele.target)
      })
    },

    _ocadShuffle: (elems) => {
      const elemArray = $(elems).get()
      for (let i = elemArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[elemArray[i], elemArray[j]] = [elemArray[j], elemArray[i]]
      }
      $(elemArray).appendTo(app.settings.masonryContainerHome)
    },

    _ocadHomeLoader: () => {
      if ($(app.settings.masonryContainerHome).hasClass('illustrators-grid')) {
        window.onload = () => {
          app._ocadMasonry(app.settings.masonryContainerHome)
          $(app.settings.masonryContainerHome).addClass('ready')
        }
      }
      if (app.settings.documentBody.hasClass('home')) {
        app._ocadShuffle(document.querySelectorAll('.gallery-item'))
      }
    },

    _ocadPanelsClose: () => {
      $('html, body').removeClass('lock-scroll')

      $('.header-item').removeClass('invert inactive')

      $('#image-modal').addClass('hidden')

      if ($('.visible').length) {
        $('.panel.visible').removeClass('visible')
      }
    },

    _ocadPanelsCloseSelective: (event) => {
      if (!$(event.target).closest('#full-image, .miniview').length) {
        $('#image-modal').addClass('hidden')

        $('.illustrator-nav-single, .illustrator-meta-wrapper').removeClass(
          'inactive'
        )
        $('html, body').removeClass('lock-scroll')
      }

      if (
        !$(event.target).closest('.panel, .header-item').length &&
        $('.panel').hasClass('visible')
      ) {
        $('.panel').attr('aria-hidden', true)
        app._ocadPanelsClose()
      }
    },

    _ocadGalleryNav: () => {
      const galleryImages = []
      let nextImage
      let itemImage
      const masonryItemAnchor = [
        ...document.querySelectorAll('.gallery-icon-anchor')
      ]

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

      $(app.settings.masonryContainer).on(
        'click',
        '.gallery-icon-anchor',
        (event) => {
          event.preventDefault()
          app._ocadLoader()
          itemImage = $(event.currentTarget)
          app.settings.imageIndex = itemImage.data('index')
          $('.image-modal-image').empty().append(imageModalSetter(itemImage))
          lazySizes.loader.unveil(document.querySelector('#full-image'))
          miniViewUpdate(app.settings.imageIndex)
        }
      )

      const modalReviel = () => {
        app._ocadLoader(false)
        app.settings.imageModal.removeClass('hidden')
        imageCaptionSetter(itemImage.data('caption'))
        $('html, body').addClass('lock-scroll')
      }
      /*
        Modal image changer
      */

      const modalImageChanger = (
        imageItem = galleryImages[app.settings.imageIndex]
      ) => {
        const image = document.getElementById('full-image')
        animate(image, { opacity: 0 })

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
          animate(image, { opacity: 1 })
        }
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
        if (
          $(e.target).is('#full-image') &&
          !$(e.target).hasClass('lazyloaded')
        ) {
          modalReviel()
        }
      })

      /*
        Keyboard event for cycling through images
      */

      document.addEventListener('keydown', (e) => {
        if ($('#full-image').length) {
          if (e.key === 'ArrowRight') {
            nextElement()
          }
          if (e.key === 'ArrowLeft') {
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
      $(document).on('click', app._ocadPanelsCloseSelective)
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          app._ocadPanelsClose()
        }
      })
      document.addEventListener('keyup', (event) => {
        if (event.key === '/') {
          document.getElementById('autocomplete').focus()
        }
      })
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
