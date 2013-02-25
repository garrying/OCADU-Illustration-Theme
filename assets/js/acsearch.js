/* Illustrator Autocomplete Module */

$(function () {

  $.widget("custom.catcomplete", $.ui.autocomplete, {
    _renderMenu: function (ul, items) {
      var that = this,
        currentCategory = "";
      $.each(items, function (index, item) {
        if (item.category != currentCategory) {
          ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
          currentCategory = item.category;
        }
        that._renderItemData(ul, item).append(item.thumb);
      });
    }
  });

  var acs_action = 'ocaduillu_autocompletesearch';
  $("#s").catcomplete({
    source: function (req, response) {
      $.getJSON(AcSearch.url + '?callback=?&action=' + acs_action, req, response).success(function (data) {
        if (data.length == 0) {
          $('#ui-id-1').html('<h2>No Results</h2>').show();
        }
      });
    },
    select: function (event, ui) {
      window.location.href = ui.item.link;
    },
    search: function (event, ui) {
      // Something here
    },
    close: function (event, ui) {
      //spomething here
    },
    minLength: 3,
  });

});