const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  login: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  canCreateUsers: {
    type: Boolean,
    required: true,
    default: false
  },
  canCreateGames: {
    type: Boolean,
    required: true,
    default: false
  },
  canBeGameMaster: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  autoCreate: true,
  autoIndex: true,
  timestamps: true
})

module.exports = mongoose.model('User', schema);