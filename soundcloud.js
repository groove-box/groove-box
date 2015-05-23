var SoundcloudWrapper = require('./libs/soundcloud_wrapper');

var sc = new SoundcloudWrapper();
sc.init();
var url = "https://soundcloud.com/twaynemusic/01-t-wayne-i-be-killin-it-prod?in=twaynemusic/sets/t-wayne-who-is-rickey-wayne";
sc.resolve(url, function(resolvedObject) {
  console.log("Body: ", resolvedObject);
});
