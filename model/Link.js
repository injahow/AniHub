const mongoose = require('mongoose')
const Schema = mongoose.Schema

const db = require('../utils/db')

const LinkSchema = new Schema({
  domain: { // 域名地址
    type: String,
    required: true
  },
  type_name: { // 类型名
    type: String,
    required: true
  },
  favicon: { // 网站图标 - 域名/favicon.ico
    type: String
  },
  add_date: { // 添加日期 - 有默认
    type: Date,
    default: Date.now
  },
  tags: { // 标签
    type: Array
  },
  region: { // 网站所属地区
    type: String,
    required: true
  },
})

module.exports = Link = db.model('Link', LinkSchema)
