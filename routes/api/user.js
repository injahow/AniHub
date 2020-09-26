/**
 * User API Routers 用户API路由
 */
const router = require('@koa/router')()

const userApi = require('../../controllers/api/user')

const routers = router
  // .post('/join', userApi.signUp) // 注册
  .post('/login', userApi.signIn) // 登陆
  .post('/logout', userApi.logout)
  .get('/info', userApi.getInfo)


module.exports = routers
