import '../styles/main.scss'

window.jQuery = window.$ = require('jquery/dist/jquery.slim.min')
require('velocity-animate')
const AutoComplete = require('@tarekraafat/autocomplete.js')
const blobs2 = require('./libs/blobs')
const lazySizes = require('lazysizes')
const Bricklayer = require('bricklayer')
const SwipeListener = require('swipe-listener')
const Two = require('two.js').default;

(() => {
  const app = {
    init: () => {
      app._ocadTitleMoment()
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
      searchField: $('#autocomplete'),
      imageModal: $('#image-modal'),
      searchLoader: $('.search-loader'),
      singleWrapper: $('.illustrator-nav-single-wrapper'),
      headerInner: $('.heading-inner'),
      imageIndex: 0,
      easeOutBack: [0.175, 0.885, 0.32, 1.275]
    },

    _ocadTitleMoment: () => {
      const titleEle = document.querySelector('.title')

      if (titleEle) {
        const two = new Two({
          autostart: true,
          width: titleEle.clientWidth,
          height: titleEle.clientHeight
        }).appendTo(titleEle)

        window.addEventListener('resize', () => {
          two.renderer.setSize(titleEle.clientWidth, titleEle.clientHeight)
        })

        const mouse = new Two.Vector(titleEle.clientWidth, titleEle.clientHeight)

        const move = (e) => {
          const x = e.clientX
          const y = e.clientY
          const v1 = makePoint(mouse)
          const v2 = makePoint(x, y)
          const line = two.makeCurve([v1, v2], true)
          line.cap = 'round'
          line.noFill()
          line.join = 'round'
          line.linewidth = 30
          line.vertices.forEach(function (v) {
            v.addSelf(line.translation)
          })
          line.translation.clear()
          mouse.set(x, y)
        }

        $(window).bind('mousemove', move)

        function makePoint (x, y) {
          if (arguments.length <= 1) {
            y = x.y
            x = x.x
          }

          const v = new Two.Vector(x, y)
          v.position = new Two.Vector().copy(v)
          return v
        }

        const strokeColors = ['base', 'set1', 'set2', 'set3']
        const randomItem = arr => arr[(Math.random() * arr.length) | 0]
        titleEle.classList.add(randomItem(strokeColors))

        titleEle.addEventListener('click', () => {
          titleEle.classList.remove(...strokeColors)
          titleEle.classList.add(randomItem(strokeColors))
        })
      }
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
        app.settings.loader.velocity('stop').velocity('fadeOut', 'fast')
      } else {
        app.settings.documentBody.css('cursor', 'progress')
        app.settings.loader.velocity('stop').velocity('fadeIn', 'fast')
      }
    },

    _ocadMasonry: selector => new Bricklayer(document.querySelector(selector)),

    _ocadSearch: () => {
      const autoCompleteJS = new AutoComplete({
        data: {
          src: async () => {
            const query = document.querySelector('#autocomplete').value
            const source = await window.fetch(`/wp-json/wp/v2/illustrator?&search=${query}`)
            const data = await source.json()
            return data.map((item) => ({
              title: item.title.rendered,
              link: item.link
            }))
          },
          key: ['title'],
          cache: false
        },
        sort: (a, b) => {
          if (a.match < b.match) return -1
          if (a.match > b.match) return 1
          return 0
        },
        selector: '#autocomplete',
        observer: true,
        threshold: 2,
        debounce: 300,
        searchEngine: 'strict',
        resultsList: {
          destination: '#autocomplete',
          position: 'afterend',
          element: 'ul'
        },
        maxResults: 5,
        resultItem: {
          element: 'li',
          highlight: {
            render: true,
            className: 'autoComplete_highlighted'
          }
        },
        noResults: (dataFeedback, generateList) => {
          generateList(autoCompleteJS, dataFeedback, dataFeedback.results)
          const result = document.createElement('li')
          result.setAttribute('tabindex', '1')
          result.innerHTML = `<span>Found No Results for ${dataFeedback.query}</span>`
          document.querySelector(`#${autoCompleteJS.resultsList.idName}`).appendChild(result)
        },
        onSelection: feedback => {
          window.location.href = feedback.selection.value.link
        }
      })
    },

    _ocadPanelSelect: (e) => {
      const targetPanel = $(e).data('panel')

      if ($(e).hasClass('invert')) {
        $(e).removeClass('invert')
        app._ocadPanelsClose()
      } else {
        $('.panel.visible').removeClass('visible').velocity('fadeOut', { display: 'flex' }, 'fast')
          .attr('aria-hidden', true)
        $('.year-item').velocity('stop').velocity({ opacity: 0, display: 'flex' }, 'fast').removeClass('loaded')

        $('.header-item').addClass('inactive').removeClass('invert')
        app.settings.logo.addClass('invert')

        $(e).addClass('invert').removeClass('inactive')
        $(`.${targetPanel}`).velocity(
          'fadeIn',
          { display: 'flex', duration: 200 }
        ).addClass('visible').attr('aria-hidden', false)
          .focus()
        // app.settings.contentContainer.velocity({ opacity: 0.3 }, 'fast');
        $('html, body').addClass('lock-scroll')

        if (targetPanel === 'year-select') {
          $('.year-item').each((index, ele) => {
            const item = $(ele)
            item.delay(80 * index).velocity({ opacity: 1, transformdisplay: 'flex' })
          })
        }
        if (targetPanel === 'search-container' && window.matchMedia('(min-width: 769px)').matches) {
          app.settings.searchField.focus()
        }
      }
    },

    _ocadPanelSelectButtons: () => {
      $('.header-item').on('click', (ele) => {
        $('.panel.velocity-animating').velocity('stop').velocity('fadeOut', 'fast')
        app._ocadPanelSelect(ele.target)
      })
    },

    _ocadShuffle: (elems, gridTarget) => {
      $(elems).sort(() => Math.random() - 0.5).prependTo($(gridTarget))
    },

    _ocadHomeLoader: () => {
      if (app.settings.documentBody.hasClass('home')) {
        app._ocadShuffle(document.querySelectorAll('.gallery-item'), '.home-grid')
      }
      if ($(app.settings.masonryContainerHome).hasClass('illustrators-grid')) {
        window.onload = () => {
          app._ocadMasonry(app.settings.masonryContainerHome)
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

    _ocadPanelsCloseFullImage: () => {
      app.settings.imageModal.velocity('fadeOut', { duration: 180 })
      $('#full-image').velocity({ translateY: '15px' }, 'fast')
    },

    _ocadPanelsClose: () => {
      // app.settings.contentContainer.velocity({ opacity: 1 }, 'fast');
      $('html, body').removeClass('lock-scroll')

      $('.header-item').removeClass('invert inactive')
      app.settings.imageModal.velocity('fadeOut', { duration: 180 })
      app.settings.logo.removeClass('invert')
      $(app.settings.masonryContainer).velocity({ opacity: 1 }, 'fast')
      $('.panel.velocity-animating').velocity('stop').velocity('fadeOut', 'fast')
      $('.panel.visible').removeClass('visible').attr('aria-hidden', true).blur()
        .velocity('fadeOut', 'fast')
      $('.year-item').velocity({ opacity: 0, display: 'flex' }, 'fast')
        .removeClass('loaded')
    },

    _ocadPanelsCloseSelective: (event) => {
      if (!$(event.target).closest('#full-image, .miniview').length &&
        app.settings.imageModal.is(':visible')) {
        app.settings.imageModal.velocity('fadeOut', { duration: 180 })
        $(app.settings.masonryContainer).velocity({ opacity: 1 }, 'fast')
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
        image.dataset.srcset = imageSource.data('srcset')
        image.sizes = imageSource.data('sizes')
        image.dataset.src = imageSource.data('src-large')
        return image
      }

      /*
        Displays relevant caption
      */

      const imageCaptionSetter = (imageCaption) => {
        const imageCaptionContainer = $('.image-modal-caption')
        if (imageCaption) {
          imageCaptionContainer.html(imageCaption)
          imageCaptionContainer.velocity({ opacity: 1 })
        } else {
          $.Velocity.animate(
            imageCaptionContainer,
            { opacity: 0 },
            'fast'
          ).then(() => {
            imageCaptionContainer.html('')
          })
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
          begin: () => {
            $(app.settings.masonryContainer).velocity({ opacity: 0 }, 'fast')
            $('#full-image').velocity({ translateY: [0, 5] }, app.settings.easeOutBack)
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
        $.Velocity.animate(
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
          image.dataset.srcset = imageItem.srcset
          image.dataset.sizes = imageItem.sizes
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

      $(document).keydown((e) => {
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
        fill: 'rgb(250,128,114)',
        strokeWidth: 1
      })
      if (document.querySelector('#error-blob-container')) {
        document.querySelector('#error-blob-container').innerHTML = svgString
      }
      if (document.querySelector('#name-blob')) {
        document.querySelector('#name-blob').innerHTML = svgString
      }
      $('link[rel="icon"]').attr('href', `data:image/svg+xml,${svgString}`)
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
