var config = require('./config/config.json');

SC = require('soundcloud-nodejs-api-wrapper');

var sc = new SC({
  client_id : config.client_id,
  client_secret : config.client_secret,
  username : config.username,
  password: config.password
});

// this client object will be explained more later on
var client = sc.client();

client.exchange_token(function(err, result) {

  var access_token = arguments[3].access_token;
  console.log('Our new access token "'+access_token+'" will expire in '); // should show your new user token and when it will expire

  console.log('Full API auth response was:');
  console.log(arguments);

  // we need to create a new client object which will use the access token now
  var clientnew = sc.client({access_token : access_token});

  clientnew.get('/me', {limit : 1}, function(err, result) {
    if (err) console.error(err);
    console.log(result); // should show a json object of your soundcloud user
  });

});
