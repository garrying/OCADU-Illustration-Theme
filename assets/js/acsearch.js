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
          data.push({
              id: 0,
              category: 'NO RESULTS FOUND',
          });
        }
        response(data);
      });
    },
    select: function (event, ui) {
      window.location.href = ui.item.link;
    },
    close: function (event, ui) {
      $('#content').removeClass('unfocused');
    },
    open: function() { 
      $('.ui-menu').width(300); 
      $('#content').addClass('unfocused');
    },
    minLength: 3,
  });

});