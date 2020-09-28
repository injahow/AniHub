const mongoose = require('mongoose')
const mongodbURI = require('./config').mongodbURI

// 连接数据库
const conn = mongoose.createConnection(
  mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
conn.on('open', () => {
  console.log('mongodb connected !')
})
conn.on('err', (err) => {
  console.log('mongodb error:', err)
})

module.exports = conn
