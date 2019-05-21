const express = require('express')
const router = express.Router()
const jwt = require('../../../tools/jwt')
const _ = require('lodash')
const { User } = require('../../../models')
const debug = require('debug')('server:api:user:index')
const ObjectId = require('mongoose').Types.ObjectId; 

router.get('/', function(req, res, next) {
  if (req.userinfo === null) {
    res.sendStatus(500).send({ message: 'Отсутствуют заголовок с данными авторизации' })
    res.end()
    return
  }
  let query = {}
  User.find(query, '-passwordHash').exec((err, doc) => {
    if (err) {
      res.status(500).send(err)
      res.end()
      return
    }
    let retVal = {
      token: jwt.encrypt({ id: req.userinfo._id }),
      data: doc
    }
    res.send(retVal)
    res.end()
  })
})

router.delete('/:id', function(req, res, next) {
  if (req.userinfo === null) {
    res.status(500).send({ message: 'Отсутствуют заголовок с данными авторизации' })
    res.end()
    return
  }
  if (''+req.userinfo['_id'] === req.params.id) {
    res.status(500).send({ message: 'Нельзя удалить самого себя'})
    res.end()
    return
  }
  User.findByIdAndDelete(new ObjectId(req.params.id), (err) => {
    if (err) {
      res.status(500).send(err)
      res.end()
      return
    }
    res.send({})
    res.end()
  })
})

module.exports = router
