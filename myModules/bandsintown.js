var apiKeys = require('../myModules/apiKeys');
var requestify = require('requestify');

module.exports = function(){

    this.search = function(city, state, date, callback){
      var parsedShows = [];
      var location = city.replace(" ", "+").concat(",", state);
      requestify.get('http://api.bandsintown.com/events/search.json?location='+location+'&radius=30&date='+date+'&app_id='+apiKeys.bandsInTown)
      .then(function(data){
        var shows = JSON.parse(data.body);
        for (var i = 0; i < shows.length; i++) {
          var showInfo = {
            "artists": [],
            "venue": shows[i].venue.name,
            "city": shows[i].venue.city,
            "region": shows[i].venue.region,
            "coordinates": {"latitude": shows[i].venue.latitude, "longitude": shows[i].venue.longitude},
          };
          shows[i].artists.forEach(function(artist){
            showInfo.artists.push(artist.name);
          });
          parsedShows.push(showInfo);
        };
        callback(parsedShows);    
      });
    };

};