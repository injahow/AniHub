/**
 * All Routers 路由合并
 */
const router = require('@koa/router')()
const path = require('path')
const fs = require('fs')

// 首页
router.get('/', async ctx => {
  await ctx.render('welcome')
});

// 同步遍历 add routes_dir
function travel(input_dir, output_dirs) {
  fs.readdirSync(input_dir).forEach((file) => {
    const pathname = path.join(input_dir, file)
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, output_dirs)
    } else {
      output_dirs.push(pathname)
    }
  })
}

let dirs = []
travel(path.join(__dirname, './'), dirs)
dirs.forEach((file_dir) => {
  const root_dir = path.join(__dirname, './')
  const require_dir = file_dir.substring(root_dir.length, file_dir.length - 3).replace('\\', '/')
  if (require_dir !== 'index') {
    //console.log(`require_dir ./${require_dir}`)
    const router_js = require(`./${require_dir}`)
    //console.log(`use /${require_dir} as router`)
    router.use(`/${require_dir}`, router_js.routes(), router_js.allowedMethods())
  }
})

module.exports = router
