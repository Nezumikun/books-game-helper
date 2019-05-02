const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const debug = require('debug')('server:api')
const { User } = require('../../models')
const secret = 'Tyger! Tyger! Birning bright!'
const jwt = require('jsonwebtoken')
let isConnected = false
const _ = require('lodash')

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://book-games:book-games@cluster-nezumikun-mxn3v.mongodb.net/book-games?retryWrites=true', {
  useNewUrlParser: true,
  useCreateIndex: true
})

const tfCleanObject = function(obj) {
  let retVal = {}
  debug ('tfCleanObject', obj)
  for (let key in obj) {
    debug (key)
    if (key.substring(0, 1) === '_') {
      continue
    }
    if (key === 'passwordHash') {
      continue
    }
    retVal[key] = obj[key]
  }
  debug ('tfCleanObject', retVal)
  return retVal
}

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
        passwordHash:  crypto.createHash('sha256')
          .update('password')
          .digest('hex'),
        description: 'Верховный администратор',
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

router.get('/login', function(req, res, next) {
  if (isConnected) {
    debug(req.headers.authorization)
    if (_.has(req.headers, 'authorization')) {
      let temp = req.headers.authorization.split(':', 2)
      if (temp.length !== 2) {
        res.sendStatus(500).send(new Error('Отсутствуют данные для проверки'))
        res.end()
        return
      }
      let query = { login: temp[0], passwordHash: temp[1] }
      debug(query)
      User.find(query, '-passwordHash').exec((err, doc) => {
        debug(err, doc)
        if (err) {
          res.status(500).send(err)
          res.end()
          return
        }
        if (doc.length === 0) {
          res.status(401)
          res.send({
            message: 'Неверный логин или пароль'
          })
          res.end()
          return
        }
        let retVal = {
          token: jwt.sign({ id: doc[0]._id }, secret),
          user: doc[0].toObject()
        }
        delete retVal.user._id
        res.send(retVal)
        res.end()
      })
    }
    else {
      res.sendStatus(500)
      res.end()
      return
    }
    /*User.find({ login: 'root' }).exec((err, doc) => {
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
    */
  }
  else {
    res.status(500).send(new Error('Отсутствует подключение к БД'))
    res.end()
  }
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
