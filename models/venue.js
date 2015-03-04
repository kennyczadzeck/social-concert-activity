var mongoose = require('mongoose');

var venueSchema = new mongoose.Schema({
  name: String,
  city: String,
  region: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  locationIds: {
    instagram: []
  }
});
var Venue = mongoose.model('venues', venueSchema);
module.exports = Venue;