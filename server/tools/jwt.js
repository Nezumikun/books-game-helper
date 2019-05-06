function JwtHelper () {
  const secret = 'Tyger! Tyger! Birning bright!'
  const jwt = require('jsonwebtoken')

  this.encrypt = function (object) {
    return jwt.sign(object, secret)
  }

  this.decrypt = function (token) {
    let decrypted = jwt.verify(token, secret, {
      maxAge: "1h"
    })
    return decrypted
  }
}

const jwt = new JwtHelper()

module.exports = jwt
