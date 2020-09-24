const mongoose = require('mongoose')
const Schema = mongoose.Schema

const db = require('../utils/db')

const AnimeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type_name: {
    type: String,
    required: true
  },
  pinyin: {
    type: Array
  },
  cover: {
    type: String
  },
  introduction: {
    type: String,
    required: true
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
    type: Array,
  },
  region: {
    type: String
  },
})

module.exports = Anime = db.model('Anime', AnimeSchema)
