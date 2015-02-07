
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
            var imageURL = show.instagramMedia[0].images.low_resolution.url
            var contentWindow = new google.maps.InfoWindow({
              content: "<img src="+imageURL+">"
            })
            var marker = new google.maps.Marker({
              position: {lat: show.coordinates.latitude, lng: show.coordinates.longitude},
              map: newMap,
              title: show.artists[0]
            });
            google.maps.event.addListener(marker, 'click', function() {
              contentWindow.open(newMap,marker);
            });
          })
        }
      });

      return newMap
    });
  });

});
