var apiKeys = require('myModules/apiKeys');
var bandsInTownModule = require('myModules/bandsInTown');
var instagramModule = require('myModules/instagram');
var express = require('express');

var BIT = new bandsInTownModule();
var instagram = new instagramModule();
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {apiKeys: apiKeys});
});

router.get('/bandsInTown', function(req, res){
  var data = req.query;
  BIT.search(data.city, data.state, data.date, instagram.findLocationIds);
  //instagram.getToken();
  res.sendStatus(200);
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
