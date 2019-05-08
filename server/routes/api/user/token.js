const express = require('express')
const router = express.Router()
const jwt = require('../../../tools/jwt')
const _ = require('lodash')
const { User } = require('../../../models')
const debug = require('debug')('server:api:user:token')
const ObjectId = require('mongoose').Types.ObjectId; 

router.get('/', function(req, res, next) {
  if (_.has(req.headers, 'x-token')) {
    let temp = jwt.decrypt(req.headers['x-token'])
    let query = { _id: new ObjectId(temp.id) }
    User.find(query, '-passwordHash -createdAt -updatedAt -__v').exec((err, doc) => {
      if (err) {
        res.status(500).send(err)
        res.end()
        return
      }
      if (doc.length === 0) {
        res.status(401)
        res.send({
          message: 'Неверный идентификатор'
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

module.exports = router
