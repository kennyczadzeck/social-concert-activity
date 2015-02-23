function initialize() {
  navigator.geolocation.getCurrentPosition(function(data) {
    var mapOptions = {
      zoom: 11,
      center: {lat: data.coords.latitude, lng: data.coords.longitude},
      mapTypeId: 'roadmap'
    };
    return new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  });
};

google.maps.event.addDomListener(window, 'load', initialize);

function eqfeed_callback(results) {
  map.data.addGeoJson(results);
};

// DOCUMENT.READY
$(function() {
  $("#blocker").hide();
  $('#show-search').on('submit', function(event){
    // $("#blocker").show();
    event.preventDefault();
    var form = $(this);
    var formData = parseForm(form);
    Maps.getNew(formData);
    Shows.query(formData, function(shows) {
      Maps.build(shows);
    });
  });
});

var parseForm = function(form) {
  var formData = {
    city: form.find('input[name="city"]').val(),
    region: form.find('input[name="region"]').val(),
    date: form.find('input[name="date"]').val(),
  };
  formData.city = formData.city.toLowerCase();
  formData.region = formData.region.toLowerCase();
  return formData
}; 


Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});