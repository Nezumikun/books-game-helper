var express = require('express');
var path = require('path');
const debug = require('debug')('server:app')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nocache = require('nocache')

var app = express();

app.use(nocache())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let routes = require('./routes/api')
for (let route in routes) {
  debug(`Create route for /api/${route}`)
  app.use('/api/' + route, routes[route])
}


module.exports = app;
