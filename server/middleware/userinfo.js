
module.exports = function() {
  return function(req, res, next) {
    const jwt = require('../tools/jwt')
    const _ = require('lodash')
    const User = require('../models/user')
    const ObjectId = require('mongoose').Types.ObjectId; 
    req.userinfo = null
    if (_.has(req.headers, 'x-token')) {
      let temp = {}
      try {
        temp = jwt.decrypt(req.headers['x-token'])
      }
      catch (err) {
        res.status(500).send(err)
        res.end()
        return
      }
      let query = { _id: new ObjectId(temp.id) }
      User.find(query, '-passwordHash -createdAt -updatedAt -__v').exec((err, doc) => {
        if (err) {
          console.error(err)
          res.status(500).send(err)
          res.end()
          return
        }
        if (doc.length === 0) {
          console.log('0')
          res.status(401)
          res.send({
            message: 'Неверный идентификатор'
          })
          res.end()
          return
        }
        req.userinfo = doc[0]
        next()
      })
    } else {
      next()
    }
  }
}
