var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var serverPath = path.join(__dirname, '..', 'server');
var routesPath = path.join(serverPath, 'routes');

var app = express();

app.locals.pretty = true;

app.locals.cache = 'memory';

app.use(require('compression')({level: 9}));

app.engine('html', require('consolidate').swig);
app.set('views', path.join(serverPath, 'views'));
app.set('view engine', 'html');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

app.use('/', require(path.join(routesPath, 'playerRoutes')));

app.use(require(path.join(routesPath, 'errorRoutes')));

module.exports = app;