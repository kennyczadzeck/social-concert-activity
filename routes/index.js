var bandsInTownModule = require('../myModules/bandsintown');
var Instagram = require('../myModules/instagram');
var express = require('express');

var BIT = new bandsInTownModule();
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
  

router.get('/bandsInTown', function(req, res){
  var data = req.query;
  BIT.search(data.city, data.state, data.date, function(foundShows) {
    Instagram.gatherAllMedia(foundShows, data.date, function(showsWithInstagramData) {
      res.send(showsWithInstagramData)
    })
  });
})

module.exports = router;
