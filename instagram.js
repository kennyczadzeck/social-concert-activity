var Instagram = (function(){

  
  var locations = [];
  var media = [];

  //Get Authorization token
  var instGetToken = function(){
    window.location.href = 'https://instagram.com/oauth/authorize/?client_id='+apiKeys.instagram+'&redirect_uri=http://127.0.0.1:8000&response_type=token'
    token = window.location.search.split('=')[1];
    console.log(token);
  }

  // 1.) Call the API for city (instFindPlaceIDs, instPlaceIdRequest)
  // 2.)






  //Request locations based on coordinates from array of shows
  var instFindPlaceIDs = function(showsArray){
    showsArray.forEach(function(show){
      instPlaceIdRequest(show);
    });
    // setTimeout(function(){
    //   getAllLocationMedia(locations);
    // }, 5000)
  };


  // Find Instagram place IDs
  var instPlaceIdRequest = function(showObject){
    window.instagramApiCallCount += 1;
      var venueName = showObject.venue;
      var coordinates = showObject.coordinates;
      $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: 'https://api.instagram.com/v1/locations/search?lat='+coordinates.latitude+'&lng='+coordinates.longitude+'&access_token='+apiKeys.instagramToken,
    }).done(function(data){
        var responseObjs = data.data
        var locationIDs = [];
        responseObjs.forEach(function(object){
          if (compareNames(showObject.venue, object.name)) {
            console.log("FOUND A MATCH");
            locationIDs.push(object.id)
          }
        })
        if (locationIDs.length > 0) {
          locations.push({"venue": showObject.venue, 
          "locationIDs": locationIDs
        });
        }
       getAllLocationMedia(locations)
      })
  }


  // Request Media from each list of venue IDs
  var getAllLocationMedia = function(locationsArray){
    locationsArray.forEach(function(location){
      instGetMedia(location);
    });
    console.log("ready to find matches");
  };

  var instGetMedia = function(venueObject){
    var minTimeStamp = Date.parse(Instagram.date)/1000 + 43200;
    var maxTimeStamp = Date.parse(Instagram.date)/1000 + 86400;
    var venueMediaObj = {
      "venue": venueObject.venue,
      "media": []
    };
    var idsArray = venueObject.locationIDs;
    idsArray.forEach(function(id){
      window.instagramApiCallCount += 1;
      $.ajax({
          type: "GET",
          dataType: 'jsonp',
          url: "https://api.instagram.com/v1/locations/"+id+"/media/recent?min_timestamp="+minTimeStamp+"&max_timestamp="+maxTimeStamp+"&access_token="+apiKeys.instagramToken,
        }).done(function(data){
          //Each call returns an object containing array
          data.data.forEach(function(media){
            venueMediaObj.media.push(media.link);
          })
        });
    });
    media.push(venueMediaObj);
  };


  var compareNames = function(name1, name2){
    var names = [name1, name2];
    var newNames = [];
    names.forEach(function(name){
      name = name.toLowerCase().replace("'", "").split(" ");
      if (name[0] === "the") {
        name.shift();
      }
      newNames.push(name);
    })
    if (newNames[0][0] === newNames[1][0]){
      console.log(newNames[0][0]);
      console.log(newNames[1][0]);
      return true
    } else {
      return false
    };
  }

  var displayMedia = function(mediaArray){
    mediaArray.forEach(function(mediaObject){
      if (mediaObject.media.length > 0) {
        console.log(mediaArray.indexOf(mediaObject));
        console.log(mediaObject.venue);
        console.log(mediaObject.media);
      }
    })
  }



  return {
    displayMedia: displayMedia,
    compareNames: compareNames,
    getToken: instGetToken,
    findIds: instFindPlaceIDs,
    getMedia: getAllLocationMedia,
    locations: locations,
    media: media
  }

}())
