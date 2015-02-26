String.prototype.splice = function(index, add) {
  return this.slice(0, index) + (add || "") + this.slice(index, this.length)
};

var Shows = (function() {

  var query = function(formData, callback) {
    $.ajax({
      url: '/bandsInTown',
      data: formData,
      success: function(res){
        console.log(res);
        $("#blocker").hide();
        process(res, callback);
      }
    });
  };

  var process = function(showsArray, callback) {
    showsArray.forEach(function(show) {
      show.title = makeTitle(show);
      show.parsedMedia = parseMedia(show);
    });
    callback ? callback(showsArray) : null;
    return showsArray
  };

  var makeTitle = function(showObj) {
    var title = showObj.venue+" - ";
    for (var i = 0; i < showObj.artists.length; i++) {
      // if there is another artist in the list, use a comma
      if(showObj.artists[i+1]) {
        var add = showObj.artists[i]+", "
        title = title.concat(add);
      } else {
          title = title.concat(showObj.artists[i]);
          return title
        }
      // if the next artist is the last one in the list
      if(i+1 === showObj.artists.legnth-1){
        var add = "and "+showObj.artists[i]
        title = title.concat(add);
      } 
    };
  };

  var parseMedia = function(showObj) {
    var parsedMedia = showObj.media.map(function(mediaObj) {
      if(mediaObj.caption) {
        var captionText = mediaObj.caption.text;
      }
      var basicInfo = {
        type: mediaObj.type,
        thumbnail: mediaObj.images.thumbnail.url,
        link: mediaObj.link
      }
      captionText ? basicInfo.caption = captionText : null;
      if(basicInfo.type === "image") {
        basicInfo.content = mediaObj.images.standard_resolution.url;
      } else if(basicInfo.type === "video") {
        basicInfo.content = mediaObj.videos.standard_resolution.url
      }
      // update URL for https
      basicInfo.thumbnail = basicInfo.thumbnail.splice(4, "s");
      basicInfo.content = basicInfo.content.splice(4, "s");
      return basicInfo
    });
    return parsedMedia
  };

  return {
    query: query,
    process: process
  }

}());