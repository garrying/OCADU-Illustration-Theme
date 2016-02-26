'use strict';

/*global FastClick:false, Masonry:false, Bloodhound:false*/

$(function () {

  'use strict';

  var app = {
    init: function init() {
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

    _fastClick: function _fastClick() {
      FastClick.attach(document.body);
    },

    _ocadLoader: function _ocadLoader(e) {
      if (e === false) {
        app.settings.loader.velocity('fadeOut', 'fast');
      } else {
        app.settings.loader.velocity('fadeIn', 'fast');
      }
    },

    _ocadMasonry: function _ocadMasonry(selector) {
      var container = document.querySelector(selector);
      var msnry = new Masonry(container, {
        itemSelector: '.gallery-item',
        transitionDuration: '0',
        percentPosition: true
      });

      msnry.layout();
    },

    _ocadSearch: function _ocadSearch() {
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
      }, {
        name: 'illustratorName',
        displayKey: function displayKey(item) {
          return item.title.rendered;
        },
        source: illustratorSearch,
        limit: 10
      }).on('typeahead:select', function ($e, resultsData) {
        window.location.href = resultsData.link;
      });
    },

    _ocadPanelSelectButtons: function _ocadPanelSelectButtons() {
      app._ocadSearch();
    },

    _ocadShuffle: function _ocadShuffle(elems) {

      var allElems = function () {
        var ret = [],
            l = elems.length;
        while (l--) {
          ret[ret.length] = elems[l];
        }
        return ret;
      }();

      var shuffled = function () {
        var l = allElems.length,
            ret = [];
        while (l--) {
          var random = Math.floor(Math.random() * allElems.length),
              randEl = allElems[random].cloneNode(true);
          allElems.splice(random, 1);
          ret[ret.length] = randEl;
        }
        return ret;
      }(),
          l = elems.length;

      while (l--) {
        elems[l].parentNode.insertBefore(shuffled[l], elems[l].nextSibling);
        elems[l].parentNode.removeChild(elems[l]);
      }
    },

    _ocadHomeLoader: function _ocadHomeLoader() {
      if ($('body').hasClass('home')) {
        app._ocadShuffle(document.querySelectorAll('.gallery-item'));
      }
      if ($(app.settings.masonryContainerHome).hasClass('illustrators-grid')) {
        $(app.settings.masonryContainerHome).imagesLoaded().done(function () {
          app._ocadMasonry(app.settings.masonryContainerHome);
        });
      }
    },

    _ocadPanelsClose: function _ocadPanelsClose() {
      app.settings.imageModal.velocity('fadeOut', { duration: 180 });
      $(app.settings.masonryContainer).velocity({ scale: 1, blur: 0, opacity: 1 }, 'fast');
      if ($('.panel').hasClass('visible')) {
        $('.panel').removeClass('visible').attr('aria-hidden', true).blur();
        $('.year-item').velocity({ opacity: 0, display: 'flex' }, 'fast').removeClass('loaded');
      }
    },

    _ocadPanelsCloseSelective: function _ocadPanelsCloseSelective(event) {

      if (!$(event.target).closest('#full-image').length && app.settings.imageModal.is(':visible')) {
        app.settings.imageModal.velocity('fadeOut', { duration: 180 });
        $(app.settings.masonryContainer).velocity({ scale: 1, blur: 0, opacity: 1 }, 'fast');
        $('.illustrator-nav-single, .illustrator-meta-wrapper').removeClass('inactive');
      }

      if (!$(event.target).closest('.panel').length && $('.panel').hasClass('visible')) {
        app._ocadPanelsClose();
      }
    },

    _ocadGalleryNav: function _ocadGalleryNav() {

      var galleryImages = [];
      var nextImage;
      var imageIndex = 0;
      var masonryItemAnchor = document.querySelectorAll('.gallery-icon-anchor');

      if ($('body').hasClass('single')) {

        $(app.settings.masonryContainer).imagesLoaded().done(function () {
          app._ocadMasonry(app.settings.masonryContainer);
        });

        for (var i = 0, items = masonryItemAnchor.length; i < items; i++) {
          $(masonryItemAnchor[i]).data('index', i);
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

      var imageModalSetter = function imageModalSetter(imageSource) {
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

      $(app.settings.masonryContainer).on('click', '.gallery-icon-anchor', function (event) {
        event.preventDefault();
        app._ocadLoader(true);
        var itemImage = $(this);
        imageIndex = itemImage.data('index');

        $('.image-modal-container').html(imageModalSetter(itemImage));

        $('#full-image').imagesLoaded().done(function () {
          app._ocadLoader(false);
          app.settings.imageModal.velocity('fadeIn', {
            duration: 180,
            begin: function begin() {
              $(app.settings.masonryContainer).velocity({ opacity: 0.25 }, 'fast');
              $('.illustrator-nav-single, .illustrator-meta-wrapper').addClass('inactive');
            },
            complete: function complete() {
              $('#full-image').velocity({ opacity: 1 }, 'fast');
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

        $.Velocity.animate($('#full-image'), 'fadeOut', 'fast').then(function () {
          var image = document.getElementById('full-image');
          image.src = nextImage.url;
          image.srcset = nextImage.srcset;
          image.sizes = nextImage.sizes;

          image.onload = function () {
            app._ocadLoader(false);
            $('#full-image').velocity('fadeIn', 'fast');
          };
        });
      }

      /**
      * Click event for cycling through images
      **/

      $('.image-modal-container').on('click', 'img', function () {
        nextElement();
      });

      /**
      * Keyboard event for cycling through images
      **/

      $(document).keydown(function (e) {
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

    _ocadUIbinding: function _ocadUIbinding() {
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
    }
  };

  /**
  * Window load ready
  **/

  $(window).load(function () {
    app._ocadLoader(false);
  });

  /**
  * Initialize
  **/

  app.init();
});
//# sourceMappingURL=data:application/json;base64,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QixDQURvRDtXQUF0RCxNQUVPLElBQUksRUFBRSxPQUFGLEtBQWMsRUFBZCxJQUFvQixJQUFJLFFBQUosQ0FBYSxRQUFiLENBQXNCLE1BQXRCLEVBQThCO0FBQzNELG1CQUFPLFFBQVAsR0FBa0IsSUFBSSxRQUFKLENBQWEsUUFBYixDQUFzQixJQUF0QixDQUEyQixNQUEzQixDQUFsQixDQUQyRDtXQUF0RDtTQUhUO09BTjZELENBQS9ELENBRnlCO0tBQVg7R0ExUWQ7Ozs7OztBQUpPLEdBc1NYLENBQUUsTUFBRixFQUFVLElBQVYsQ0FBZSxZQUFXO0FBQ3hCLFFBQUksV0FBSixDQUFnQixLQUFoQixFQUR3QjtHQUFYLENBQWY7Ozs7OztBQXRTVyxLQThTWCxDQUFJLElBQUosR0E5U1c7Q0FBWCxDQUFGIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qZ2xvYmFsIEZhc3RDbGljazpmYWxzZSwgTWFzb25yeTpmYWxzZSwgQmxvb2Rob3VuZDpmYWxzZSovXG5cbiQoZnVuY3Rpb24oKSB7XG4gIFxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGFwcCA9IHtcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2Zhc3RDbGljaygpO1xuICAgICAgdGhpcy5fb2NhZFBhbmVsU2VsZWN0QnV0dG9ucygpO1xuICAgICAgdGhpcy5fb2NhZEhvbWVMb2FkZXIoKTtcbiAgICAgIHRoaXMuX29jYWRQYW5lbHNDbG9zZSgpO1xuICAgICAgdGhpcy5fb2NhZEdhbGxlcnlOYXYoKTtcbiAgICAgIHRoaXMuX29jYWRVSWJpbmRpbmcoKTtcbiAgICB9LFxuXG4gICAgc2V0dGluZ3M6IHtcbiAgICAgIGNvbnRlbnRDb250YWluZXI6ICcjY29udGVudCcsXG4gICAgICBsb2FkZXI6ICQoJy5sb2FkZXInKSwgXG4gICAgICBtYXNvbnJ5Q29udGFpbmVyOiAnI3BhY2stY29udGVudCcsXG4gICAgICBtYXNvbnJ5Q29udGFpbmVySG9tZTogJyNpbGx1c3RyYXRvcnMnLFxuICAgICAgbmV4dEl0ZW06ICQoJy5uYXYtbmV4dCBhJyksXG4gICAgICBwcmV2SXRlbTogJCgnLm5hdi1wcmV2aW91cyBhJyksXG4gICAgICBzZWFyY2hGaWVsZDogJCgnLnNlYXJjaC1maWVsZCcpLFxuICAgICAgaW1hZ2VNb2RhbDogJCgnI2ltYWdlLW1vZGFsJylcbiAgICB9LFxuXG4gICAgX2Zhc3RDbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgRmFzdENsaWNrLmF0dGFjaChkb2N1bWVudC5ib2R5KTtcbiAgICB9LFxuXG4gICAgX29jYWRMb2FkZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYXBwLnNldHRpbmdzLmxvYWRlci52ZWxvY2l0eSgnZmFkZU91dCcsICdmYXN0Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHAuc2V0dGluZ3MubG9hZGVyLnZlbG9jaXR5KCdmYWRlSW4nLCAnZmFzdCcpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBfb2NhZE1hc29ucnk6IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgdmFyIG1zbnJ5ID0gbmV3IE1hc29ucnkoIGNvbnRhaW5lciwge1xuICAgICAgICBpdGVtU2VsZWN0b3I6ICcuZ2FsbGVyeS1pdGVtJyxcbiAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAnMCcsXG4gICAgICAgIHBlcmNlbnRQb3NpdGlvbjogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIG1zbnJ5LmxheW91dCgpO1xuICAgICAgXG4gICAgfSxcblxuICAgIF9vY2FkU2VhcmNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaWxsdXN0cmF0b3JTZWFyY2ggPSBuZXcgQmxvb2Rob3VuZCh7XG4gICAgICAgIGRhdHVtVG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMub2JqLndoaXRlc3BhY2UoJ3RpdGxlJyksXG4gICAgICAgIHF1ZXJ5VG9rZW5pemVyOiBCbG9vZGhvdW5kLnRva2VuaXplcnMud2hpdGVzcGFjZSxcbiAgICAgICAgcmVtb3RlOiB7XG4gICAgICAgICAgdXJsOiAnL3dwLWpzb24vd3AvdjIvaWxsdXN0cmF0b3I/ZmlsdGVyW3NdPSVRVUVSWScsXG4gICAgICAgICAgd2lsZGNhcmQ6ICclUVVFUlknXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgIFxuICAgICAgaWxsdXN0cmF0b3JTZWFyY2guaW5pdGlhbGl6ZSgpO1xuICAgICAgIFxuICAgICAgYXBwLnNldHRpbmdzLnNlYXJjaEZpZWxkLnR5cGVhaGVhZCh7XG4gICAgICAgIGhpbnQ6IGZhbHNlXG4gICAgICAgIH0se1xuICAgICAgICBuYW1lOiAnaWxsdXN0cmF0b3JOYW1lJyxcbiAgICAgICAgZGlzcGxheUtleTogZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLnRpdGxlLnJlbmRlcmVkO1xuICAgICAgICB9LFxuICAgICAgICBzb3VyY2U6IGlsbHVzdHJhdG9yU2VhcmNoLFxuICAgICAgICBsaW1pdDogMTBcbiAgICAgIH0pLm9uKCd0eXBlYWhlYWQ6c2VsZWN0JywgZnVuY3Rpb24oJGUsIHJlc3VsdHNEYXRhKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSByZXN1bHRzRGF0YS5saW5rO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9vY2FkUGFuZWxTZWxlY3RCdXR0b25zOiBmdW5jdGlvbiAoKSB7XG4gICAgICBhcHAuX29jYWRTZWFyY2goKTtcbiAgICB9LFxuXG4gICAgX29jYWRTaHVmZmxlOiBmdW5jdGlvbiAoZWxlbXMpIHtcblxuICAgICAgdmFyIGFsbEVsZW1zID0gKGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgcmV0ID0gW10sIGwgPSBlbGVtcy5sZW5ndGg7XG4gICAgICB3aGlsZSAobC0tKSB7IHJldFtyZXQubGVuZ3RoXSA9IGVsZW1zW2xdOyB9XG4gICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIHZhciBzaHVmZmxlZCA9IChmdW5jdGlvbigpe1xuICAgICAgICAgIHZhciBsID0gYWxsRWxlbXMubGVuZ3RoLCByZXQgPSBbXTtcbiAgICAgICAgICB3aGlsZSAobC0tKSB7XG4gICAgICAgICAgICB2YXIgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYWxsRWxlbXMubGVuZ3RoKSxcbiAgICAgICAgICAgICAgcmFuZEVsID0gYWxsRWxlbXNbcmFuZG9tXS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICBhbGxFbGVtcy5zcGxpY2UocmFuZG9tLCAxKTtcbiAgICAgICAgICAgIHJldFtyZXQubGVuZ3RoXSA9IHJhbmRFbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJldDsgXG4gICAgICAgIH0pKCksIGwgPSBlbGVtcy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGwtLSkge1xuICAgICAgICAgIGVsZW1zW2xdLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHNodWZmbGVkW2xdLCBlbGVtc1tsXS5uZXh0U2libGluZyk7XG4gICAgICAgICAgZWxlbXNbbF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtc1tsXSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29jYWRIb21lTG9hZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJCgnYm9keScpLmhhc0NsYXNzKCdob21lJykpIHtcbiAgICAgICAgYXBwLl9vY2FkU2h1ZmZsZSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdhbGxlcnktaXRlbScpICk7XG4gICAgICB9XG4gICAgICBpZiAoJChhcHAuc2V0dGluZ3MubWFzb25yeUNvbnRhaW5lckhvbWUpLmhhc0NsYXNzKCdpbGx1c3RyYXRvcnMtZ3JpZCcpKSB7XG4gICAgICAgICQoYXBwLnNldHRpbmdzLm1hc29ucnlDb250YWluZXJIb21lKS5pbWFnZXNMb2FkZWQoKS5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXBwLl9vY2FkTWFzb25yeShhcHAuc2V0dGluZ3MubWFzb25yeUNvbnRhaW5lckhvbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX29jYWRQYW5lbHNDbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgYXBwLnNldHRpbmdzLmltYWdlTW9kYWwudmVsb2NpdHkoJ2ZhZGVPdXQnLHtkdXJhdGlvbjogMTgwIH0pO1xuICAgICAgJChhcHAuc2V0dGluZ3MubWFzb25yeUNvbnRhaW5lcikudmVsb2NpdHkoe3NjYWxlOjEsIGJsdXI6MCwgb3BhY2l0eToxfSwnZmFzdCcpO1xuICAgICAgaWYgKCQoJy5wYW5lbCcpLmhhc0NsYXNzKCd2aXNpYmxlJykpIHtcbiAgICAgICAgJCgnLnBhbmVsJykucmVtb3ZlQ2xhc3MoJ3Zpc2libGUnKS5hdHRyKCdhcmlhLWhpZGRlbicsdHJ1ZSkuYmx1cigpO1xuICAgICAgICAkKCcueWVhci1pdGVtJykudmVsb2NpdHkoeyBvcGFjaXR5OiAwLCBkaXNwbGF5OiAnZmxleCcgfSwnZmFzdCcpLnJlbW92ZUNsYXNzKCdsb2FkZWQnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgX29jYWRQYW5lbHNDbG9zZVNlbGVjdGl2ZTogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgaWYgKCEkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnI2Z1bGwtaW1hZ2UnKS5sZW5ndGggJiYgYXBwLnNldHRpbmdzLmltYWdlTW9kYWwuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgYXBwLnNldHRpbmdzLmltYWdlTW9kYWwudmVsb2NpdHkoJ2ZhZGVPdXQnLHtkdXJhdGlvbjoxODB9KTtcbiAgICAgICAgJChhcHAuc2V0dGluZ3MubWFzb25yeUNvbnRhaW5lcikudmVsb2NpdHkoe3NjYWxlOjEsIGJsdXI6MCwgb3BhY2l0eToxfSwnZmFzdCcpO1xuICAgICAgICAkKCcuaWxsdXN0cmF0b3ItbmF2LXNpbmdsZSwgLmlsbHVzdHJhdG9yLW1ldGEtd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdpbmFjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAoISQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcucGFuZWwnKS5sZW5ndGggJiYgJCgnLnBhbmVsJykuaGFzQ2xhc3MoJ3Zpc2libGUnKSkge1xuICAgICAgICBhcHAuX29jYWRQYW5lbHNDbG9zZSgpO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIF9vY2FkR2FsbGVyeU5hdjogZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBnYWxsZXJ5SW1hZ2VzID0gW107XG4gICAgICB2YXIgbmV4dEltYWdlO1xuICAgICAgdmFyIGltYWdlSW5kZXggPSAwO1xuICAgICAgdmFyIG1hc29ucnlJdGVtQW5jaG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdhbGxlcnktaWNvbi1hbmNob3InKTtcblxuICAgICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygnc2luZ2xlJykpIHtcblxuICAgICAgICAkKGFwcC5zZXR0aW5ncy5tYXNvbnJ5Q29udGFpbmVyKS5pbWFnZXNMb2FkZWQoKS5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFwcC5fb2NhZE1hc29ucnkoYXBwLnNldHRpbmdzLm1hc29ucnlDb250YWluZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaXRlbXMgPSBtYXNvbnJ5SXRlbUFuY2hvci5sZW5ndGg7IGkgPCBpdGVtczsgaSsrKSB7XG4gICAgICAgICAgJChtYXNvbnJ5SXRlbUFuY2hvcltpXSkuZGF0YSgnaW5kZXgnLGkpO1xuICAgICAgICAgIHZhciBpbWFnZUVsZW1lbnQgPSAkKG1hc29ucnlJdGVtQW5jaG9yW2ldKTtcbiAgICAgICAgICB2YXIgaW1hZ2VTZXQgPSB7XG4gICAgICAgICAgICB1cmw6IGltYWdlRWxlbWVudC5hdHRyKCdocmVmJyksXG4gICAgICAgICAgICBzcmNzZXQ6IGltYWdlRWxlbWVudC5kYXRhKCdzcmNzZXQnKSxcbiAgICAgICAgICAgIHNpemVzOiBpbWFnZUVsZW1lbnQuZGF0YSgnc2l6ZXMnKVxuICAgICAgICAgIH07XG4gICAgICAgICAgZ2FsbGVyeUltYWdlcy5wdXNoKGltYWdlU2V0KTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgKiBDcmVhdGVzIGluaXRpYWwgaW1hZ2UgZWxlbWVudFxuICAgICAgKiovXG5cbiAgICAgIHZhciBpbWFnZU1vZGFsU2V0dGVyID0gZnVuY3Rpb24oaW1hZ2VTb3VyY2UpIHtcbiAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgIGltYWdlLmFsdCA9ICdGdWxsIGlsbHVzdHJhdGlvbic7XG4gICAgICAgIGltYWdlLmlkID0gJ2Z1bGwtaW1hZ2UnO1xuICAgICAgICBpbWFnZS5zcmMgPSBpbWFnZVNvdXJjZS5hdHRyKCdocmVmJyk7XG4gICAgICAgIGltYWdlLnNyY3NldCA9IGltYWdlU291cmNlLmRhdGEoJ3NyY3NldCcpO1xuICAgICAgICBpbWFnZS5zaXplcyA9IGltYWdlU291cmNlLmRhdGEoJ3NpemVzJyk7XG4gICAgICAgIHJldHVybiBpbWFnZTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgKiBNYXNvbnJ5IGl0ZW0gY2xpY2tcbiAgICAgICoqL1xuXG4gICAgICAkKGFwcC5zZXR0aW5ncy5tYXNvbnJ5Q29udGFpbmVyKS5vbiggJ2NsaWNrJywgJy5nYWxsZXJ5LWljb24tYW5jaG9yJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhcHAuX29jYWRMb2FkZXIodHJ1ZSk7XG4gICAgICAgIHZhciBpdGVtSW1hZ2UgPSAkKHRoaXMpO1xuICAgICAgICBpbWFnZUluZGV4ID0gaXRlbUltYWdlLmRhdGEoJ2luZGV4Jyk7XG4gICAgICAgIFxuICAgICAgICAkKCcuaW1hZ2UtbW9kYWwtY29udGFpbmVyJykuaHRtbChpbWFnZU1vZGFsU2V0dGVyKGl0ZW1JbWFnZSkpO1xuICAgICAgICBcbiAgICAgICAgJCgnI2Z1bGwtaW1hZ2UnKS5pbWFnZXNMb2FkZWQoKS5kb25lKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgYXBwLl9vY2FkTG9hZGVyKGZhbHNlKTtcbiAgICAgICAgICBhcHAuc2V0dGluZ3MuaW1hZ2VNb2RhbC52ZWxvY2l0eSgnZmFkZUluJywgeyBcbiAgICAgICAgICAgIGR1cmF0aW9uOiAxODAsIFxuICAgICAgICAgICAgYmVnaW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAkKGFwcC5zZXR0aW5ncy5tYXNvbnJ5Q29udGFpbmVyKS52ZWxvY2l0eSh7b3BhY2l0eTowLjI1fSwnZmFzdCcpO1xuICAgICAgICAgICAgICAkKCcuaWxsdXN0cmF0b3ItbmF2LXNpbmdsZSwgLmlsbHVzdHJhdG9yLW1ldGEtd3JhcHBlcicpLmFkZENsYXNzKCdpbmFjdGl2ZScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHsgXG4gICAgICAgICAgICAgICQoJyNmdWxsLWltYWdlJykudmVsb2NpdHkoe29wYWNpdHk6MX0sJ2Zhc3QnKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcblxuICAgICAgLyoqXG4gICAgICAqIEhhbmRsZXMgcHJvZ3Jlc3NpbmcgdGhyb3VnaCB0aGUgZ2FsbGVyeVxuICAgICAgKiovXG5cbiAgICAgIGZ1bmN0aW9uIG5leHRFbGVtZW50KGRpcmVjdGlvbikge1xuICAgICAgICBhcHAuX29jYWRMb2FkZXIodHJ1ZSk7XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3JldmVyc2UnKSB7XG4gICAgICAgICAgLS1pbWFnZUluZGV4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICsraW1hZ2VJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbWFnZUluZGV4ID09PSBnYWxsZXJ5SW1hZ2VzLmxlbmd0aCkge1xuICAgICAgICAgIGltYWdlSW5kZXggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltYWdlSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgaW1hZ2VJbmRleCA9IGdhbGxlcnlJbWFnZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5leHRJbWFnZSA9IGdhbGxlcnlJbWFnZXNbaW1hZ2VJbmRleF07XG5cbiAgICAgICAgJC5WZWxvY2l0eS5hbmltYXRlKCQoJyNmdWxsLWltYWdlJyksICdmYWRlT3V0JywgJ2Zhc3QnKVxuICAgICAgICAudGhlbiggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Z1bGwtaW1hZ2UnKTtcbiAgICAgICAgICBpbWFnZS5zcmMgPSBuZXh0SW1hZ2UudXJsO1xuICAgICAgICAgIGltYWdlLnNyY3NldCA9IG5leHRJbWFnZS5zcmNzZXQ7XG4gICAgICAgICAgaW1hZ2Uuc2l6ZXMgPSBuZXh0SW1hZ2Uuc2l6ZXM7XG5cbiAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFwcC5fb2NhZExvYWRlcihmYWxzZSk7XG4gICAgICAgICAgICAkKCcjZnVsbC1pbWFnZScpLnZlbG9jaXR5KCdmYWRlSW4nLCdmYXN0Jyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAqIENsaWNrIGV2ZW50IGZvciBjeWNsaW5nIHRocm91Z2ggaW1hZ2VzXG4gICAgICAqKi9cblxuICAgICAgJCgnLmltYWdlLW1vZGFsLWNvbnRhaW5lcicpLm9uKCdjbGljaycsJ2ltZycsZnVuY3Rpb24oKSB7XG4gICAgICAgIG5leHRFbGVtZW50KCk7XG4gICAgICB9KTtcblxuICAgICAgLyoqXG4gICAgICAqIEtleWJvYXJkIGV2ZW50IGZvciBjeWNsaW5nIHRocm91Z2ggaW1hZ2VzXG4gICAgICAqKi9cblxuICAgICAgJChkb2N1bWVudCkua2V5ZG93bihmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChhcHAuc2V0dGluZ3MuaW1hZ2VNb2RhbC5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDM5KSB7XG4gICAgICAgICAgICBuZXh0RWxlbWVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAzNykge1xuICAgICAgICAgICAgbmV4dEVsZW1lbnQoJ3JldmVyc2UnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSxcblxuICAgIF9vY2FkVUliaW5kaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICQoJy5jbG9zZS1wYW5lbCcpLm9uKCdjbGljaycsIGFwcC5fb2NhZFBhbmVsc0Nsb3NlKTtcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIGFwcC5fb2NhZFBhbmVsc0Nsb3NlU2VsZWN0aXZlKS5rZXlkb3duKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IDI3KSB7XG4gICAgICAgICAgYXBwLl9vY2FkUGFuZWxzQ2xvc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYXBwLnNldHRpbmdzLmltYWdlTW9kYWwuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAzNyAmJiBhcHAuc2V0dGluZ3MucHJldkl0ZW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBhcHAuc2V0dGluZ3MucHJldkl0ZW0uYXR0cignaHJlZicpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSAzOSAmJiBhcHAuc2V0dGluZ3MubmV4dEl0ZW0ubGVuZ3RoKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBhcHAuc2V0dGluZ3MubmV4dEl0ZW0uYXR0cignaHJlZicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICogV2luZG93IGxvYWQgcmVhZHlcbiAgKiovXG5cbiAgJCh3aW5kb3cpLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgYXBwLl9vY2FkTG9hZGVyKGZhbHNlKTtcbiAgfSk7XG5cbiAgLyoqXG4gICogSW5pdGlhbGl6ZVxuICAqKi9cblxuICBhcHAuaW5pdCgpO1xuXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
