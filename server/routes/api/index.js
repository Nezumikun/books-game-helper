const express = require('express');
const router = express.Router();
const debug = require('debug')('server:api')
let isConnected = false

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://book-games:book-games@cluster-nezumikun-mxn3v.mongodb.net/book-games?retryWrites=true', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  debug('Mongoose connected')
  isConnected = true
});

router.get('/', function(req, res, next) {
  if (isConnected) {
    res.send({
      status: 'ok'
    })
  }
  else {
    res.sendStatus(500)
  }
  res.end();
});

module.exports = router;
