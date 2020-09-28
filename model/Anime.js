const mongoose = require('mongoose')
const Schema = mongoose.Schema

const db = require('../utils/db')

const AnimeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type_name: {
    type: String
  },
  pinyin: {
    type: Array
  },
  cover: {
    type: String
  },
  introduction: {
    type: String
  },
  publish: {
    type: Date
  },
  actor: {
    type: Array
  },
  staff: {
    type: Array
  },
  tags: {
    type: Array
  },
  region: {
    type: String
  },
  add_date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Anime = db.model('Anime', AnimeSchema)
