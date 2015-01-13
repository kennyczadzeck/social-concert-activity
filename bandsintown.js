var BIT = (function(){

  var shows = [];

  var bandsInTown = function(city, state, date){
    Instagram.date = date;
    var location = city.replace(" ", "+").concat(",", state)
    console.log(location);
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: 'http://api.bandsintown.com/events/search.json?location='+location+'&radius=30&date='+date+'&app_id=ENGAGED_AUDIENCES'
    }).done(function(data){
      parseShows(data);
      console.log("BIT request complete");
      console.log(Instagram.date);
    })

  }

  var parseShows = function(showsArray){
    showsArray.forEach(function(show){
      //Object that will hold relevant show data
      var showInfo = {
        "artists": [],
        "venue": show.venue.name,
        "city": show.venue.city,
        "region": show.venue.region,
        "country": show.venue.region,
        "coordinates": {"latitude": show.venue.latitude, "longitude": show.venue.longitude},
      };
      //Get the artists out of the show listing
      show.artists.forEach(function(artist){
        showInfo.artists.push(artist.name);
      })
      //Get the venue name and location out of the show listing
      shows.push(showInfo);
    })
    Instagram.findIds(shows);
  }

  return {
    search: bandsInTown,
    shows: shows
  }

}());