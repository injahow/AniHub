/**
 * Bilibili Anime Routers
 */
const router = require('@koa/router')()

const bilibiliApi = require('../../controllers/site/bilibili')

const routers = router
  .get('/', bilibiliApi.getAnimeDetail) // 查询


module.exports = routers
