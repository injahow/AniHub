const jwt = require('jsonwebtoken')
const secret = require('../utils/config').secret
const { returnCtxBody } = require('../utils/api')

async function checkToken(ctx, next) {

  const url = ctx.request.url
  const pass_url = ['/api/user/login', '/api/user/join', '/api/user/info']
  let is_pass_url = false
  // choose: open api other than user ? no.
  // ? let is_safe_url = true
  const real_url = url.substr(0, 15) // not after ?/...
  pass_url.forEach((i) => {
    if (real_url.indexOf(i) != -1) {
      is_pass_url = true
    }
  })
  // 跳过 public & public/static
  if (!is_pass_url && (url === '/' || url.substr(0, 2) === '/?' || url.substr(0, 8) === '/static/')) {
    is_pass_url = true
  }
  // ? if (!is_pass_url && url.indexOf('/api/user/') != -1) {
  // ?   is_safe_url = false
  // ? }
  // pass token
  if (ctx.request.method === 'OPTIONS' || is_pass_url) { // ? || is_safe_url) {
    await next()
  } else {
    const authorization = ctx.header.authorization
    if (!authorization) {
      returnCtxBody(ctx, {
        code: 401,
        error: 'No Token'
      })
      return
    }
    const parts = authorization.split(' ')
    if (parts.length === 2) {
      //取出token
      const scheme = parts[0]
      const token = parts[1]
      let is_ok = false, need_update = false
      if (/^Bearer$/i.test(scheme)) {
        // 验证token是否合法
        jwt.verify(token, secret, {
          complete: true
        }, (error, decode) => {
          if (error) {
            const expiredAt = parseInt(new Date(error.expiredAt).getTime() / 1000);
            const allowTime = parseInt(new Date().getTime() / 1000) - parseInt(expiredAt);
            if (allowTime <= 60 * 60) {
              // 失效60分钟内更新
              is_ok = true
              need_update = true
            } else {
              is_ok = false
            }
            //console.log(error)
          } else {
            is_ok = true
            //console.log(decode.payload)
          }
        })
      }

      if (is_ok) {
        if (need_update) {
          // todo: 更新token
        }
        await next()
      } else {
        // 客户端重新登录
        returnCtxBody(ctx, {
          code: 401,
          error: 'Expired Token'
        })
        return
      }

    } else {
      returnCtxBody(ctx, {
        code: 401,
        error: 'Error Token'
      })
      return
    }
  }
}

module.exports = checkToken
