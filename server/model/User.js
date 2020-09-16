const mongoose = require('mongoose')
const Schema = mongoose.Schema

const db = require('../utils/db')

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avater: {
    type: String
  },
  reg_time: {
    type: Date,
    default: Date.now
  }

})

module.exports = User = db.model('User', UserSchema)
