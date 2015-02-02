var requestify = require('requestify');

module.exports = function() {
  this.load = function(callback){
    requestify.get('https://maps.googleapis.com/maps/api/js?key=AIzaSyDADcp3AczDleifGLCOrAusMgPq_GUyXR4').then(function(resp){
      callback(resp)
    });
  };
  
}