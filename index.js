var PlayerWrapper = require('./libs/player_wrapper');
var file = __dirname + '/demo2.mp3';
// var player = new Player(file);
var playerWrapper = new PlayerWrapper();

playerWrapper.add(file);

// player.play();



// setTimeout(function(){
// 	console.log(file);
// 	// player.add(file);
// 	// player.play();
// }, 1000);