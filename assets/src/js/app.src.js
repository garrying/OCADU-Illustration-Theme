'use strict';

//
// Typeahead Search
//

var illustratorSearch = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: '/wp-json/posts?type=illustrator&filter[posts_per_page]=100&filter[s]=%QUERY'
});
 
illustratorSearch.initialize();
 
$('.search-field').typeahead(null, {
  name: 'illustratorName',
  displayKey: 'title',
  source: illustratorSearch.ttAdapter()
}).on('typeahead:selected', function($e, resultsData){
  window.location.href = resultsData.link;
});

//
// Initialize Functions
//