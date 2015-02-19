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

  // $("#blocker").hide();

  $('#show-search').on('submit', function(event){
    $("#blocker").show();
    event.preventDefault();
    var formData = {
      city: $(this).find('input[name="city"]').val(),
      region: $(this).find('input[name="region"]').val(),
      date: $(this).find('input[name="date"]').val(),
    };
    formData.city = formData.city.toLowerCase();
    formData.region = formData.region.toLowerCase();

    $.get('https://maps.googleapis.com/maps/api/geocode/json?address='+formData.city+',+'+formData.region+'&key=AIzaSyDADcp3AczDleifGLCOrAusMgPq_GUyXR4', 
      function(response){
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
          // $("#blocker").hide();

          // Create data sets for Handlebars to use
          res.forEach(function(showObj) {
            showObj.title = function(showObj) {
              var venue = showObj.venue+" - ";
              for (var i = 0; i < showObj.artists.length; i++) {
                if(showObj.artists[i+1]) {
                  var add = showObj.artists[i]+", "
                  venue = venue.concat(add);
                } else if(i > 0){
                  var add = "and "+showObj.artists[i]
                  venue = venue.concat(add);
                } else {
                  venue = venue.concat(showObj.artists[i]);
                }
              };
              return venue
            }(showObj)
            showObj.parsedMedia = [];
            showObj.media.forEach(function(mediaObj) {
              if(mediaObj.type === "image") {
                showObj.parsedMedia.push({
                  type: "image",
                  content: mediaObj.images.standard_resolution.url,
                  link: mediaObj.link
                });
              } else if(mediaObj.type === "video") {
                showObj.parsedMedia.push({
                  type: "video",
                  content: mediaObj.videos.standard_resolution.url,
                  link: mediaObj.link
                });
              }
            });

            // Create Google Maps markers
            var marker = new google.maps.Marker({
              context: showObj,
              position: {lat: showObj.coordinates.latitude, lng: showObj.coordinates.longitude},
              map: newMap,
              title: showObj.venue
            });

            // Add DOM listeners to open modals
            google.maps.event.addListener(marker, 'click', function() {
              $.ajax({
                url: 'javascripts/handlebars.template',
                cache: true,
                success: function(loadedTemplate) {
                  var show = marker.context;
                  var source = loadedTemplate;
                  var template = Handlebars.compile(source);
                  $('#myModal').html(template(show));
                  $('#myModal').modal('show');
                }               
              });    
            });
          });
        }
      });
    });
  });

  $('#instagram_tab').on('click', function (event) {
    event.preventDefault()
    $(this).tab('show')
  });

  $('#twitter_tab').on('click', function (event) {
    event.preventDefault()
    $(this).tab('show')
  })

});
