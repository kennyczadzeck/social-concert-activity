
function initialize() {
  navigator.geolocation.getCurrentPosition(function(data) {
    var mapOptions = {
      zoom: 11,
      center: {lat: data.coords.latitude, lng: data.coords.longitude},
      mapTypeId: 'roadmap'
    };
    return new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);


function eqfeed_callback(results) {
  map.data.addGeoJson(results);
}

var makeGallery = function(instaObjArray, callback) {
  var gallery = [];
  instaObjArray.forEach(function(object) {
    gallery.push('<img src="'+object.images.thumbnail.url+'">')
    if(gallery.length === instaObjArray.length) {
      callback(gallery)
    }
  });
}

var createTitle = function(artistsArray, venueName, callback) {
  var callStack = artistsArray.length;
  var title = ['<h3>'+venueName+'</h3>', '<ul>'];
  artistsArray.forEach(function(artist) {
    callStack -= 1;
    title.push('<li>'+artist+'</li>');
    if(callStack === 0) {
      title.push('</ul>');
      callback(title);
    }
  });
}


// DOCUMENT.READY
$(function() {

  $('#show-search').on('submit', function(event){
    event.preventDefault();
    var formData = {
      city: $(this).find('input[name="city"]').val(),
      region: $(this).find('input[name="region"]').val(),
      date: $(this).find('input[name="date"]').val(),
    };
    formData.city = formData.city.toLowerCase();
    formData.region = formData.region.toLowerCase();

    $.get('https://maps.googleapis.com/maps/api/geocode/json?address='+formData.city+',+'+formData.region+'&key=AIzaSyDADcp3AczDleifGLCOrAusMgPq_GUyXR4', function(response){
      var coordinates = response.results[0].geometry.location;
      var mapOptions = {
          zoom: 11,
          center: {lat: coordinates.lat, lng: coordinates.lng},
          mapTypeId: 'roadmap'
        };
      var newMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      $.ajax({
        url: '/bandsInTown',
        data: formData,
        success: function(res){
          console.log(res);
          res.forEach(function(show) {
            createTitle(show.artists, show.venue, function(title) {
              makeGallery(show.instagramMedia, function(gallery) {
                var div = ['<div>','</div>'];
                var titleAndGallery = title.concat(gallery).join("");
                div.splice(1,0,titleAndGallery)
                var allContent = div.join("");
                var contentWindow = new google.maps.InfoWindow({
                  content: allContent
                });
                var marker = new google.maps.Marker({
                  position: {lat: show.coordinates.latitude, lng: show.coordinates.longitude},
                  map: newMap,
                  title: show.artists[0]
                });
                google.maps.event.addListener(marker, 'click', function() {
                  contentWindow.open(newMap,marker);
                });
              });
            })
          });
        }
      });

      return newMap
    });
  });

});
