const jwt = require('jsonwebtoken')
const secret = require('../utils/config').secret

async function checkToken(ctx, next) {

  const url = ctx.request.url

  // ? 跳过不检查token
  if (ctx.request.method === 'OPTIONS' ||
    url === '/api/user/login' ||
    url === '/api/user/join' ||
    url.substring(0, 14) === '/api/user/info') {
    await next()
  } else {

    const authorization = ctx.header.authorization
    if (!authorization) {
      ctx.body = {
        code: 400,
        message: 'no token'
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
          message: 'token 过期'
        }
        return
      }

    } else {
      ctx.body = {
        code: 400,
        message: 'token error'
      }
      return
    }

  }
}

module.exports = checkToken
