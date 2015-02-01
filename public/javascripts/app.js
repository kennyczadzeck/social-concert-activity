

// $.get('/googleMaps', function(response){
//   console.log(response)
//   eval(response.body)
// });

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
    $.ajax({
      url: '/bandsInTown',
      data: formData,
      success: function(res){console.log(res)}
    });
    $.get('https://maps.googleapis.com/maps/api/geocode/json?address='+formData.city+',+'+formData.region+'&key=AIzaSyDADcp3AczDleifGLCOrAusMgPq_GUyXR4', function(response){
      var coordinates = response.results[0].geometry.location;
      var mapOptions = {
          zoom: 11,
          center: {lat: coordinates.lat, lng: coordinates.lng},
          mapTypeId: 'roadmap'
        };
      return new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    });
  });
});
