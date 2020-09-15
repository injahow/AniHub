/**
 * Bilibili Anime Routers
 */
const router = require('@koa/router')();

const animeApi = require('../../controllers/site/bilibili');

const routers = router
  .get('/', animeApi.getAnimeDetail) // 查询



module.exports = routers
