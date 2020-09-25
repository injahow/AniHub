const mongoose = require('mongoose')
const Schema = mongoose.Schema

const db = require('../utils/db')

const SubLinkSchema = new Schema({
  domain_id: { // 域名地址
    type: Schema.Types.ObjectId,
    ref: 'Link',
  },
  link_path: { // 域名路径
    type: String,
    required: true
  },
  type_name: { // 类型名 - 文件夹
    type: String
  },
  tags: { // 标签
    type: Array
  },
  add_date: { // 添加日期 - 有默认
    type: Date,
    default: Date.now
  }
})

module.exports = SubLink = db.model('SubLink', SubLinkSchema)
