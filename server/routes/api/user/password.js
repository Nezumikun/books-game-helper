const express = require('express')
const router = express.Router()
const jwt = require('../../../tools/jwt')
const _ = require('lodash')
const { User } = require('../../../models')
const debug = require('debug')('server:api:user:password')
const ObjectId = require('mongoose').Types.ObjectId; 

router.post('/', function(req, res, next) {
  if (_.has(req.body, 'token')) {
    debug (`Token = ${req.body.token}`)
    let token = {}
    try {
      token = jwt.decrypt(req.body.token)
    }
    catch (error) {
      res.status(error.name === 'TokenExpiredError' ? 401 : 500).send(error)
      res.end()
      return
    }
    let query = { _id: new ObjectId(token.id), passwordHash: req.body.oldPasswordHash }
    debug(query)
    User.find(query, '-passwordHash').exec((err, doc) => {
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
      let user = doc[0]
      user.updateOne({
          $set: {
            passwordHash: req.body.newPasswordHash
          }
        },
        { },
        (err, writeOpResult) => {
          if (err) {
            res.status(500).send(err)
            res.end()
            return
          }
          res.send({})
          res.end()
        })
    })
  }
  else {
    res.status(401).send(new Error('Отсутствуют заголовок с данными авторизации'))
    res.end()
    return
  }
})

module.exports = router
