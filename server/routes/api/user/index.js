const express = require('express')
const router = express.Router()
const jwt = require('../../../tools/jwt')
const _ = require('lodash')
const { User } = require('../../../models')
const debug = require('debug')('server:api:user:index')
const ObjectId = require('mongoose').Types.ObjectId; 

router.post('/:token', function(req, res, next) {
  debug (`Token = ${req.params.token}`)
  let token = {}
  try {
    token = jwt.decrypt(req.params.token)
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
    res.send(doc[0])
    res.end()
  })
})

module.exports = router
