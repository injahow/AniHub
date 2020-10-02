const jwt = require('jsonwebtoken')
const secret = require('../utils/config').secret

async function checkToken(ctx, next) {

  const url = ctx.request.url
  const pass_url = ['/api/user/login', '/api/user/join', '/api/user/info']
  let is_pass_url = false
  // choose: open api other than user ? no.
  // ? let is_unsafe_url = true
  pass_url.forEach((i) => {
    if (url.indexOf(i) != -1) {
      is_pass_url = true
    }
  })
  // ? if (!is_pass_url && url.indexOf('/api/user/') != -1) {
  // ?   is_unsafe_url = true
  // ? }
  // pass token
  if (ctx.request.method === 'OPTIONS' || is_pass_url) {
    await next()
  } else {// ? if (is_unsafe_url) {
    const authorization = ctx.header.authorization
    if (!authorization) {
      ctx.body = {
        code: 401,
        message: 'No Token'
      }
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
        ctx.body = {
          code: 401,
          error: 'Expired Token'
        }
        return
      }

    } else {
      ctx.body = {
        code: 401,
        error: 'Error Token'
      }
      return
    }

  }
  // ? else { // not user api
  // ?   await next()
  // ? }
}

module.exports = checkToken
