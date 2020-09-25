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
  avatar: {
    type: String
  },
  anime_type_name: {
    type: Array,
    default: ['正片', '电影', '其他']
  },
  anime_tags: {
    type: Array,
    default: [
      '青春', '恋爱', '治愈', '催泪', '推理',
      '悬疑', '神魔', '妖怪', '科幻', '机战',
      '战争', '热血', '冒险'
    ]
  },
  actor_options: {
    type: Array,
    default: ['未知']
  },
  staff_options: {
    type: Array,
    default: ['未知']
  },
  region_options: {
    type: Array,
    default: ['中国', '日本', '美国']
  },
  link_type_name: {
    type: Array,
    default: [
      '休闲娱乐', '论坛社区',
      '科技工具', '服务托管'
    ]
  },
  link_tags: {
    type: Array,
    default: [
      '动漫', '视频',
      '下载', '游戏',
      '音乐'
    ]
  },
  reg_time: {
    type: Date,
    default: Date.now
  }

})

module.exports = User = db.model('User', UserSchema)
