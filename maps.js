//var Maps = (function(){

  function initialize() {
    var mapOptions = {
      zoom: 12,
      center: {lat: -33.865427, lng: 151.196123},
      mapTypeId: google.maps.MapTypeId.MAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // Create a <script> tag and set the USGS URL as the source.
    var script = document.createElement('script');

    script.src = 'http://earthquake.usgs.gov/earthquakes/feed/geojsonp/2.5/week';
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  function eqfeed_callback(results) {
    map.data.addGeoJson(results);
  }

  google.maps.event.addDomListener(window, 'load', initialize);

//})();

