/**
 * SubLink API Routers 子链接API路由
 */
const router = require('@koa/router')()

const linkApi = require('../../controllers/api/link')

const routers = router
  .get('/', linkApi.getListSub) // 列表
  .post('/', linkApi.addSub) // 增加
  .post('/index', linkApi.getIndexSub)
  .get('/:id', linkApi.getDetailSub) // 查询详情
  .put('/:id', linkApi.changeSub) // 修改

module.exports = routers
