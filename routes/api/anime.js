/**
 * Anime API Routers 动漫API路由
 */
const router = require('@koa/router')()

const animeApi = require('../../controllers/api/anime')

const routers = router
  .get('/', animeApi.getList) // 查询全部
  .post('/', animeApi.add) // 增加
  .post('/index', animeApi.getIndex) // 按规则查询全部
  .put('/:id', animeApi.change) // 修改
  .del('/:id', animeApi.delete) // 删除
  .get('/:id', animeApi.getDetail) // 查询详细

module.exports = routers
