var apiKeys = require('myModules/apiKeys');
var requestify = require('requestify');


  // 1.)
  var gatherAllLocationIDs = function(showsArray, date){
    console.log('gatherShowMedia...');
    //find all instagram location IDs for venues
    for (var i = 0; i < showsArray.length; i++) {
      !function(i){
        queryLocationName(showsArray[i], function(locationIDsArray){
          showsArray[i].locationIDs = locationIDsArray;
        })
        console.log(showsArray[i]);
      }(i);
    };
  };  


  // 2.)  Find Instagram place IDs
  var queryLocationName = function(showObject, callback) {
    var venueName = showObject.venue;
    var coordinates = showObject.coordinates;
    requestify.get('https://api.instagram.com/v1/locations/search?lat='+coordinates.latitude+'&lng='+coordinates.longitude+'&access_token='+apiKeys.instagramToken)
    .then(function(data){
      var parsedJSONData = JSON.parse(data.body);
      var responseObjs = parsedJSONData.data
      var locationIDs = [];
      for (var i = 0; i < responseObjs.length; i++) {
        !function(i){
          compareNames(showObject.venue, responseObjs[i].name, function(match){
            if (match === true) {
              locationIDs.push(responseObjs[i].id)
            }
          });
        }(i);
      }
      return callback(locationIDs)
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

  var queryLocationMedia = function(showObject, date, callback){
    var minTimeStamp = Date.parse(date)/1000 + 43200;
    var maxTimeStamp = Date.parse(date)/1000 + 86400;
    var idsArray = showObject.locationIDs;
    for (var i = 0; i < idsArray.length; i++) {
      !function(i){
        var mediaArray = [];
        $.ajax({
          type: "GET",
          dataType: 'jsonp',
          url: 'https://api.instagram.com/v1/locations/'+idsArray[i]+'/media/recent?min_timestamp='+minTimeStamp+'&max_timestamp='+maxTimeStamp+'&access_token='+apiKeys.instagramToken
        }).done(function(data){
          //Each call returns an object containing array
          data.data.forEach(function(media){
            mediaArray.push(media.link);
          });
          callback(mediaArray);
        });
      }(i);
    }
  };

module.exports = {
  gatherShowMedia: gatherShowMedia
}
