var Maps = (function() {

  var googleApi = function(formData) {
    return 'https://maps.googleapis.com/maps/api/geocode/json?address='+
    formData.city+',+'+formData.region+
    '&key=AIzaSyDADcp3AczDleifGLCOrAusMgPq_GUyXR4';
  };

  var newMap;
  var getNew = function(formData) {
    var data = formData;
    $.get(googleApi(data), function(response) {
      var coordinates = response.results[0].geometry.location;
      var mapOptions = {
        zoom: 11,
        center: {lat: coordinates.lat, lng: coordinates.lng},
        mapTypeId: 'roadmap'
      };
      newMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    });
  };

  var buildMarkers = function(showsArray, callback) {
    var markers = showsArray.map(function(showObj) {
      return new google.maps.Marker({
        context: showObj,
        position: {lat: showObj.coordinates.latitude, lng: showObj.coordinates.longitude},
        map: newMap,
        title: showObj.venue
      });
    });
    addClickListeners(markers)
    callback();
    return markers
  }

  // Add DOM listeners to open modals
  var addClickListeners = function(markersArray) {
    markersArray.forEach(function(marker) {
      google.maps.event.addListener(marker, 'click', function() {
        $.ajax({
          url: 'javascripts/handlebars.template',
          cache: true,
          success: function(loadedTemplate) {
            var show = marker.context;
            var source = loadedTemplate;
            var template = Handlebars.compile(source);
            $('#myModal').html(template(show));
            $('.item').first().addClass("active");
            $('#myModal').modal('show');
          }               
        });
      });
    });
  };

  return {
    getNew: getNew,
    build: buildMarkers
  }

}());