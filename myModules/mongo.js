process.env.NODE_ENV === 'development' ? require('../myModules/apiKeys') : null;
var mongo = require('mongodb');
var mongoose = require('mongoose');




var insertData = function(collectionName, data, callback) {
  mongo.MongoClient.connect(uri, function(err, db) {
    if(err) throw err;
    var thisCollection = db.collection(collectionName);
    thisCollection.insert(data, function(err, results) {
      callback(results);
    });
  });
};

var getData = function(collectionName, paramsObj, callback) {
  mongo.MongoClient.connect(uri, function(err, db) {
    if(err) throw err;
    var thisCollection = db.collection(collectionName);
    thisCollection.find(paramsObj, function(err, results) {
      callback(results);
    });
  });
};

var updateData = function(collectionName, paramsObj, callback) {
  mongo.MongoClient.connect(uri, function(err, db) {
    if(err) throw err;
    var thisCollection = db.collection(collectionName);
    thisCollection.update(paramsObj, function(err, data) {
      callback(results);
    });
  });
};

var deleteData = function(collectionName, paramsObj, callback) {
  mongo.MongoClient.connect(uri, function(err, db) {
    if(err) throw err;
    var thisCollection = db.collection(collectionName);
    thisCollection.remove(paramsObj, function(err, data) {

    });
  });
};

module.exports = {
  insert: insertData
}