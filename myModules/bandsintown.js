var apiKeys = require('../myModules/apiKeys');
var requestify = require('requestify');

module.exports = function(){

  this.search = function(city, state, date, callback){
    var parsedShows = [];
    var location = city.replace(" ", "+").concat(",", state);
    requestify.get('http://api.bandsintown.com/events/search.json?location='+location+'&radius=30&date='+date+'&app_id='+apiKeys.bandsInTown)
    .then(function(data){
      var shows = JSON.parse(data.body);
      var idCounter = 1;
      shows.forEach(function(show) {
        var showInfo = {
          id: idCounter,
          artists: [],
          venue: show.venue.name,
          city: show.venue.city,
          region: show.venue.region,
          coordinates: {latitude: show.venue.latitude, longitude: show.venue.longitude},
        };
        show.artists.forEach(function(artist){
          showInfo.artists.push(artist.name);
        });
        parsedShows.push(showInfo);
        idCounter++;
      });
      callback(parsedShows);    
    });
  };

};