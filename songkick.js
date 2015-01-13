var Songkick = (function(){

  var parseLocation = function(city, state){
    var newCity = city.replace(" ", "+").toLowerCase();
    var newState = state.toUpperCase();
    return newCity+'+'+newState;
  };

  var getShows = function(city, state){
    var location = parseLocation(city, state);
    var url = 'http://api.songkick.com/api/3.0/search/locations.json?query='+location+'&apikey='+apiKeys.songkick;
    $.get(url, function(response){
      console.log(response.resultsPage.results.location);
    });
  };

  return {getShows: getShows}

}());