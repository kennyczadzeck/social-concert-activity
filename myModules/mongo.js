process.env.NODE_ENV === 'development' ? require('../myModules/apiKeys') : null;
var mongo = require('mongodb');

var uri = process.env.MONGOLAB_URI;

var insertData = function(collectionName, data, callback) {
  mongo.MongoClient.connect(uri, function(err, db) {
    if(err) throw err;
    var thisCollection = db.collection(collectionName);
    thisCollection.insert(data, function(err, results) {
      callback(results);
    });
  });
};

module.exports = {
  insert: insertData
}