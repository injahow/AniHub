const path = require('path')
const Koa = require('koa')
const convert = require('koa-convert')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const static = require('koa-static')

const checkToken = require('./middleware/checkToken')

const config = require('./utils/config')
const routers = require('./routes/index')

const app = new Koa()

app.use(async (ctx, next) => {
  await next()
  if (ctx.status === 404) {
    ctx.status = 404
    ctx.body = {
      code: 404,
      error: 'Not Found'
    }
  }
})

// 配置日志
app.use(convert(koaLogger()))

// 配置body解析
app.use(bodyParser())

// 配置跨域-同域可注释
app.use(cors({
  origin: () => {
    return config.corsURI
  },
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
}))

// ! checkToken after cors 放于跨域之后
app.use(checkToken)

// 配置静态资源|安装vue-admin-anihub
app.use(static(path.join(__dirname, 'public')))

// 配置路由
app.use(routers.routes()).use(routers.allowedMethods())

// 监听端口
app.listen(config.port, () => {
  console.log(`server running at http://localhost:${config.port}`)
})
