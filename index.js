
function urlReceivedCallback (url) {

 	console.log('Just received URL: \'' + url + '\' for playback');
}

var Server = require('./libs/server');

var myServer = new Server(1337);
myServer.init(urlReceivedCallback);

myServer.start();

//var PlayerWrapper = require('./libs/player_wrapper');
//var file = __dirname + '/demo2.mp3';
// var player = new Player(file);
//var playerWrapper = new PlayerWrapper();

//playerWrapper.add(file);

// player.play();



// setTimeout(function(){
// 	console.log(file);
// 	// player.add(file);
// 	// player.play();
// }, 1000);