var apiKeys = require('../myModules/apiKeys');
var requestify = require('requestify');


  // 1.)
  var gatherAllMedia = function(showsArray, date, callback) {
    var minTimeStamp = Date.parse(date)/1000 + 43200;
    var maxTimeStamp = Date.parse(date)/1000 + 86400;
    var stackCount = 0;
    var resultsArray = [];
    //FIND ALL LOCATION IDs FOR VENUES
    showsArray.forEach(function(show) {
      !function(show) {
        show.instagramMedia = [];
        show.instagramLocations = [];
        var venueName = show.venue;
        var coordinates = show.coordinates;
        requestify.get('https://api.instagram.com/v1/locations/search?lat='+coordinates.latitude+'&lng='+coordinates.longitude+'&access_token='+apiKeys.instagramToken)
        .then(function(allLocations) {
          var parsedLocationData = JSON.parse(allLocations.body);
          var locationObjects = parsedLocationData.data

          // CHECK VENUE NAME AND LOCATION NAMES FOR MATCHES
          locationObjects.forEach(function(location) {
            !function(location, show) {
              compareNames(venueName, location.name, function(match) {
                if(match === true) {
                  show.instagramLocations.push(location.id);
                  stackCount += 1;

                  // GET MEDIA LINKS
                  requestify.get('https://api.instagram.com/v1/locations/'+location.id+'/media/recent?min_timestamp='+minTimeStamp+'&max_timestamp='+maxTimeStamp+'&access_token='+apiKeys.instagramToken)
                  .done(function(data) {
                    stackCount -= 1;
                    var media = JSON.parse(data.body);
                    if(media.data.length > 0) {
                      var mediaStack = media.data.length;
                      media.data.forEach(function(post) {
                        show.instagramMedia.push(post);
                        mediaStack -= 1;
                      });
                      if(mediaStack === 0) {
                        resultsArray.push(show)
                      }
                    }

                    // RETURN WHEN STACK IS CLEARED
                    if(stackCount === 0) {
                      callback(resultsArray);
                    }
                  });
                }
              });
            }(location, show);
          });
        });
      }(show);
    });
  };  

  var compareNames = function(name1, name2, callback){
    var names = [name1, name2];
    var newNames = [];
    names.forEach(function(name){
      name = name.toLowerCase().replace(("\'"||"'"), "").split(" ");
      if (name[0] === "the") {
        name.shift();
      }
      newNames.push(name);
    })
    if (newNames[0][0] === newNames[1][0]){
      return callback(true)
    } else {
      return callback(false)
    }
  };


module.exports = {
  gatherAllMedia: gatherAllMedia
}
