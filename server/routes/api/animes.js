/**
 * Anime API Routers 动漫API路由
 */
const router = require('@koa/router')()

const animeApi = require('../../controllers/api/animes')

const routers = router
  .get('/', animeApi.getList) // 查询全部
  .post('/', animeApi.add) // 增加
  .put('/:id', animeApi.change) // 修改
  .del('/:id', animeApi.delete) // 删除

  .get('/detail/:id', animeApi.getDetail) // 查询详细

module.exports = routers
