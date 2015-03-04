process.env.NODE_ENV === 'development' ? require('./myModules/apiKeys') : null;
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var BIT = require('./myModules/bandsintown');
var Instagram = require('./myModules/instagram');
var mongoose = require('mongoose');

// Instantiating Express
var app = express();
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

// Connect to Mongo
mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connection.on('error', console.error.bind(console.error, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log("DB connection open")
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

// Get current date to restrict user input
var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();
var currentDate = year+"-"+month+"-"+day;
app.get('/', function(req, res) {
  res.render('index', {maxDate: currentDate});
});

app.get('/bandsInTown', function(req, res){
  var data = req.query;
  BIT.search(data.city, data.state, data.date, function(foundShows) {
    Instagram.gatherAllMedia(foundShows, data.date, function(showsWithInstagramData) {
      res.send(showsWithInstagramData)
    });
  });
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log("DEV ERROR HANDLER");
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log("PROD ERROR HANDLER");
  console.log(err);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
