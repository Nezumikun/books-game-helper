const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: ObjectId,
    required: true,
    ref: "User"
  },
  allowAccess: [{
    type: [ObjectId],
    required: false,
    ref: "User"
  }]
}, {
  autoCreate: true,
  autoIndex: true,
  timestamps: true
})

module.exports = mongoose.model('Game', schema);