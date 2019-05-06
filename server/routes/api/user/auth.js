const express = require('express')
const router = express.Router()
// const debug = require('debug')('server:api:user:auth')
const jwt = require('../../../tools/jwt')
const _ = require('lodash')
const { User } = require('../../../models')

router.get('/', function(req, res, next) {
  if (_.has(req.headers, 'authorization')) {
    let temp = req.headers.authorization.split(':', 2)
    if (temp.length !== 2) {
      res.sendStatus(500).send(new Error('Отсутствуют данные для проверки'))
      res.end()
      return
    }
    let query = { login: temp[0], passwordHash: temp[1] }
    User.find(query, '-passwordHash -createdAt -updatedAt -__v').exec((err, doc) => {
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
        token: jwt.encrypt({ id: doc[0]._id }),
        user: doc[0].toObject()
      }
      delete retVal.user._id
      res.send(retVal)
      res.end()
    })
  }
  else {
    res.sendStatus(500).send(new Error('Отсутствуют заголовок с данными авторизации'))
    res.end()
    return
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
