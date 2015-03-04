process.env.NODE_ENV === "development" ? require('../myModules/apiKeys') : null;
var apiKeys = {instagramToken: process.env.instagramToken};
var mongoose = require('mongoose');
var Venue = require('../models/venue');
var requestify = require('requestify');
var Q = require('q');

var InstagramLocationsURL = function(show){
  return 'https://api.instagram.com/v1/locations/search?lat=' +
  show.coordinates.latitude+'&lng='+show.coordinates.longitude+
  '&access_token='+apiKeys.instagramToken;
};

var InstagramMediaURL = function(locationId, show) {
  return 'https://api.instagram.com/v1/locations/'+locationId+
  '/media/recent?min_timestamp='+show.date.minTime+'&max_timestamp='+
  show.date.maxTime+'&count=35&access_token='+apiKeys.instagramToken;
};

var compareNames = function(name1, name2, callback){
  var names = [name1, name2];
  names.forEach(function(name){
    name = name.toLowerCase().replace(("\'"||"'"), "").split(" ");
    name[0] === "the" ? name.shift() : null;
  });
  return names[0][0] === names[1][0] ? callback(true) : callback(false);
};

var parseLocations = function(locationsResponse, show, callback) {
  var parsedLocationData = JSON.parse(locationsResponse.body);
  var locations = parsedLocationData.data;
  locations.forEach(function(location) {
    compareNames(show.venue, location.name, function(match) {
      match === true ? show.locationIds.push(location.id) : null;
    });
  });
  callback ? callback(show) : null;
};

var saveVenueInfo = function(show) {
  var newVenue = new Venue({
    name: show.venue,
    city: show.city,
    region: show.region,
    coordinates: {
      latitude: show.coordinates.latitude,
      longitude: show.coordinates.longitude
    },
    locationIds: {
      instagram: show.locationIds
    }
  });
  newVenue.save(function(err) {
    if(err) throw err;
    console.log("saved "+ show.venue);
  });
};

var getLocationIds = function(show) {
  show.locationIds = show.locationIds || [];
  return requestify.get(InstagramLocationsURL(show));
};

var getMedia = function(locationId, show) {
  return requestify.get(InstagramMediaURL(locationId, show))
};

var queryAllLocations = function(show, callback) {
  show.media = show.media || [];
  var mediaPromiseArray = show.locationIds.map(function(location) {
    var mediaQueryPromise = getMedia(location, show);
    mediaQueryPromise.then(function(mediaResponse) {
      var parsedMedia = JSON.parse(mediaResponse.body);
      if(parsedMedia.data.length > 0) {
        show.media = show.media.concat(parsedMedia.data);
      }
    });
    return mediaQueryPromise
  });
  return Q.allSettled(mediaPromiseArray);
};

var addTimeStampsToShows = function(showsArray, date) {
  var eastOrWest = showsArray[0].coordinates.longitude < 1 ? -1 : 1;
  var offset = Math.ceil(eastOrWest * showsArray[0].coordinates.longitude * 24 / 360 * 3600);
  showsArray.forEach(function(show) {
    show.date = {};
    show.date.minTime = Date.parse(date)/1000 + 64800 + offset;
    show.date.maxTime = Date.parse(date)/1000 + 97200 + offset;
  });
  return showsArray;
};

var dataCollection = function(show) {
  var deferred = Q.defer();
  getLocationIds(show)
    .then(function(locationsResponse) {
      parseLocations(locationsResponse, show, function(venue) {
        saveVenueInfo(venue);
      });
    })
    .then(function() {  
      queryAllLocations(show)
        .then(function() {
          deferred.resolve(show);
        })
      })
    .catch(function(error) {
      console.log("INSTAGRAM FLOW ERROR");
      console.log(show);
      console.log(error);
    });
  return deferred.promise;
};

var gatherAllMedia = function(showsArray, date, callback) {
  var arrayWithTimeStamps = addTimeStampsToShows(showsArray, date); 
  var populatedShowsArray = arrayWithTimeStamps.map(function(show) {
    return dataCollection(show);
  });
  return Q.allSettled(populatedShowsArray)
          .then(function(results){
            var finalArray = [];
            results.forEach(function(result) {
              result.value.media.length > 0 ? finalArray.push(result.value) : null;
            });
            callback(finalArray);
          });
};

module.exports = {
  gatherAllMedia: gatherAllMedia
}