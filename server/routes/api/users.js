/**
 * User API Routers 用户API路由
 */
const router = require('@koa/router')()

const userApi = require('../../controllers/api/users')

const routers = router
  .post('/join', userApi.signUp) // 注册
  .post('/login', userApi.signIn) // 登陆

module.exports = routers
