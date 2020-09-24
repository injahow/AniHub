/**
 * Link API Routers 链接API路由
 */
const router = require('@koa/router')()

const linkApi = require('../../controllers/api/link')

const routers = router
  .get('/', linkApi.getList) // 列表
  .post('/', linkApi.add) // 增加
  .get('/:id', linkApi.getDetail) // 查询详情
  .put('/:id', linkApi.change) // 修改

module.exports = routers
