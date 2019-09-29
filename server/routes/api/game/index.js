const express = require('express')
const router = express.Router()
const jwt = require('../../../tools/jwt')
const _ = require('lodash')
const { User, Game } = require('../../../models')
const debug = require('debug')('server:api:user:index')
const ObjectId = require('mongoose').Types.ObjectId; 
const crypto = require('crypto')

router.get('/', function(req, res, next) {
  if (req.userinfo === null) {
    res.sendStatus(500).send({ message: 'Отсутствуют заголовок с данными авторизации' })
    res.end()
    return
  }
  let query = {}
  Game
    .find(query)
    .populate('creator', 'login _id')
    .exec((err, doc) => {
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

router.post('/:id?', function(req, res, next) {
  if (req.userinfo === null) {
    res.status(500).send({ message: 'Отсутствуют заголовок с данными авторизации' })
    res.end()
    return
  }
  console.log(req.body)
  let user = req.body.user
  if (!user._id) {
    let newUser = new User({
      login: user.login,
      passwordHash:  crypto.createHash('sha256')
        .update(user.password)
        .digest('hex'),
      description: user.description,
      canBeGameMaster: user.canBeGameMaster,
      canCreateUsers: user.canCreateUsers,
      canCreateGames: user.canCreateGames
    })
    newUser.save((err) => {
      if (err) {
        res.status(500).send(err)
        res.end()
      } else {
        res.send(newUser.toObject())
        res.end()
      }
    })
  } else {
    User.findById(user._id, (err, find) => {
      if (err) {
        res.status(500).send(err)
        res.end()
        return
      }
      find.login = user.login
      find.description = user.description
      find.canBeGameMaster = user.canBeGameMaster
      find.canCreateUsers = user.canCreateUsers
      find.canCreateGames = user.canCreateGames
      find.save((err) => {
        if (err) {
          res.status(500).send(err)
          res.end()
        } else {
          res.send(find.toObject())
          res.end()
        }
      })
    })
  }
})

module.exports = router
