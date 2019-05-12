const express = require('express')
const router = express.Router()
const jwt = require('../../../tools/jwt')
const _ = require('lodash')
const { User } = require('../../../models')
const debug = require('debug')('server:api:user:index')
const ObjectId = require('mongoose').Types.ObjectId; 

router.get('/', function(req, res, next) {
  if (_.has(req.headers, 'x-token')) {
    let temp = jwt.decrypt(req.headers['x-token'])
    let query = {
      // _id: {
      //   $ne: new ObjectId(temp.id)
      // }
    }
    User.find(query, '-passwordHash').exec((err, doc) => {
      if (err) {
        res.status(500).send(err)
        res.end()
        return
      }
      let retVal = {
        token: jwt.encrypt({ id: temp.id }),
        data: doc
      }
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
