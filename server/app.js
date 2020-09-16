const path = require('path')
const Koa = require('koa')
const convert = require('koa-convert')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const static = require('koa-static')
const render = require('koa-art-template')

const config = require('./utils/config')
const routers = require('./routes/index')

const app = new Koa()

// 配置日志
app.use(convert(koaLogger()))

// 配置body解析
app.use(bodyParser())

// 配置跨域
app.use(cors({
  origin: () => {
    return config.corsURI
  },
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
}))

// 配置模板渲染引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.art',
  debug: process.env.NODE_ENV !== 'production'
})

// 配置静态资源
app.use(static(path.join(__dirname, 'static')))

// 配置路由
app.use(routers.routes()).use(routers.allowedMethods())

// 监听端口
app.listen(config.port, () => {
  console.log(`server started on http://localhost:${config.port}`)
})
