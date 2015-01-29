var instagramApiCallCount = 0;
var twitterApiCallCount = 0;
var facebookApiCallCount = 0;





console.log("app.js is available...");



$('#show-search').on('submit', function(event){
  event.preventDefault();
  console.log(this);
})

































// Search BandsInTown for show data
$('#show-search').on('submit', function(event){
  event.preventDefault();
  var city = $('.search-city').val();
  $('.search-city').val("");
  var state = $('.search-state').val();
  $('.search-state').val("");
  var date = $('.search-date').val();
  BIT.search(city, state, date)
  var results = $.get('https://maps.googleapis.com/maps/api/geocode/json?address='+city+',+'+state+'&key='+apiKeys.googleMaps);
  var coordinates = results.done(function(data){
    var coordinates = data.results[0].geometry.location
    map.setCenter(new google.maps.LatLng( {center:{lat: coordinates.lat, lng: coordinates.lng}, zoom: 12} ) );
    console.log(coordinates);
  });
});














var findMatch = function (shows, media) {
  var matchedPairs = [];
    for (var i = 0; i < shows.length; i++) {
      for (var x = 0; x < media.length; x++) {
        if (shows[i].venue === media[x].venue){
          matchedPairs.push([shows[i], media[x]]);
        }
      };
    };
  console.log(matchedPairs);
}