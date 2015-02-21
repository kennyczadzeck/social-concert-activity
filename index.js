var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var BIT = require('./myModules/bandsintown');
var Instagram = require('./myModules/instagram');

// Instantiating Express
var app = express();

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

// Serve public files
app.use(express.static(__dirname + '/public/'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/bandsInTown', function(req, res){
  var data = req.query;
  BIT.search(data.city, data.state, data.date, function(foundShows) {
    Instagram.gatherAllMedia(foundShows, data.date, function(showsWithInstagramData) {
      res.send(showsWithInstagramData)
    });
  });
});
