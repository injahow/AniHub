const mongoose = require('mongoose')
const Schema = mongoose.Schema

const db = require('../utils/db')

const AnimeLinkSchema = new Schema({

  sub_link_id: { // 域名地址
    type: Schema.Types.ObjectId,
    ref: 'Link',
  },
  anime_id: { // 动漫id
    type: Schema.Types.ObjectId,
    ref: 'Anime',
  }
})

module.exports = AnimeLink = db.model('AnimeLink', AnimeLinkSchema)
