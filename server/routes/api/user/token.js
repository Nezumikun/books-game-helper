const express = require('express')
const router = express.Router()
const jwt = require('../../../tools/jwt')
const _ = require('lodash')
const { User } = require('../../../models')
const debug = require('debug')('server:api:user:token')
const ObjectId = require('mongoose').Types.ObjectId; 

router.get('/', function(req, res, next) {
  if (req.userinfo === null) {
    res.sendStatus(500).send(new Error('Отсутствуют заголовок с данными авторизации'))
    res.end()
    return
  }
  let retVal = {
    token: jwt.encrypt({ id: req.userinfo._id }),
    user: req.userinfo
  }
  delete retVal.user._id
  res.send(retVal)
  res.end()
})

module.exports = router
