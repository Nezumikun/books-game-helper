const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const debug = require('debug')('server:api')
const { User } = require('../../models')
const secret = 'Tyger! Tyger! Birning bright!'
let isConnected = false

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://book-games:book-games@cluster-nezumikun-mxn3v.mongodb.net/book-games?retryWrites=true', {
  useNewUrlParser: true,
  useCreateIndex: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  debug('Mongoose connected')
  User.find({ login: 'root' }).exec((err, doc) => {
    // debug(err, doc)
    if (doc.length === 0) {
      debug('Root not found')
      let root = new User({
        login: 'root',
        passwordHash:  crypto.createHmac('sha256', secret)
          .update('password')
          .digest('hex'),
        canBeGameMaster: false,
        canCreateUsers: true
      })
      root.save((err) => {
        if (err) {
          console.error(err)
        } else {
          debug('Root saved')
          isConnected = true
        }
      })
    }
    else {
      debug('Root found')
      isConnected = true
    }
  })
})

router.get('/', function(req, res, next) {
  if (isConnected) {
    res.send({
      status: 'ok'
    })
  }
  else {
    res.sendStatus(500)
  }
  res.end()
})

module.exports = router
