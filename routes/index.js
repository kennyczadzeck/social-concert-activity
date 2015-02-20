var apiKeys = require('../myModules/apiKeys');
var bandsInTownModule = require('../myModules/bandsInTown');
var mapsModule = require('../myModules/maps');
var express = require('express');

var Maps = new mapsModule();
var BIT = new bandsInTownModule();
var Instagram = require('../myModules/instagram');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {apiKeys: apiKeys});
});
  

router.get('/bandsInTown', function(req, res){
  var data = req.query;
  BIT.search(data.city, data.state, data.date, function(foundShows) {
    Instagram.gatherAllMedia(foundShows, data.date, function(showsWithInstagramData) {
      res.send(showsWithInstagramData)
    })
  });
})


/* GET Userlist page (w/ data from Mongo) */
// router.get('/userlist', function(req, res){
//   var db = req.rb;
//   var collection = db.get('usercollection');
//   collection.find({},{}, function(e, docs){
//     res.render('userlist', {
//       "userlist": docs
//     });
//   });
// });

module.exports = router;
