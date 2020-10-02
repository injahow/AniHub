const mongoose = require('mongoose')
const { mongodbURI } = require('./config')

// 连接数据库
const conn = mongoose.createConnection(
  mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
conn.on('open', () => {
  console.log('db connected !')
})
conn.on('disconnected', () => {
  console.log('db disconnected !');
})
conn.on('err', err => {
  console.log('db error :', err)
})

module.exports = conn
