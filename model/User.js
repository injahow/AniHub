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
  introduction: {
    type: String
  },
  github_name: {
    type: String
  },
  weibo_name: {
    type: String
  },
  twitter_name: {
    type: String
  },
  facebook_name: {
    type: String
  },
  anime_options: {
    type: Object,
    default: {
      'type_name': ['正片', '电影', '其他'],
      'tags': [
        '青春', '恋爱', '治愈', '催泪', '推理',
        '悬疑', '神魔', '妖怪', '科幻', '机战',
        '战争', '热血', '冒险'
      ],
      'actor': ['未知'],
      'staff': ['未知'],
      'region': ['中国', '日本', '其他']
    }
  },
  link_options: {
    type: Object,
    default: {
      'type_name': [
        '休闲娱乐', '论坛社区',
        '科技工具', '服务托管'
      ],
      'tags': [
        '动漫', '视频', '下载',
        '游戏', '音乐'
      ],
      'region': ['中国', '美国', '其他']
    }
  },
  sublink_options: {
    type: Object,
    default: {
      'type_name': [
        '视频', '学习',
        '购物', '博客'
      ],
      'tags': [
        '动漫', '游戏', '音乐', '其他'
      ]
    }
  },
  status: {
    type: Boolean,
    default: true
  },
  reg_time: {
    type: Date,
    default: Date.now
  }

})

module.exports = User = db.model('User', UserSchema)
