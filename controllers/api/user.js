const gravatar = require('gravatar')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const returnCtxBody = require('../../utils/api').returnCtxBody

const User = require('../../model/User')

module.exports = {

  /**
   * 用户登录
   * @param  {object} ctx
   */
  async signIn(ctx) {

    const { email } = ctx.request.body
    const exist_user = await User.findOne({ email })
    if (exist_user) {
      if (exist_user.password === md5(ctx.request.body.password)) {

        const secret = require('../../utils/config').secret
        // 生成 token
        const payload = {
          id: exist_user.id,
          name: exist_user.name,
          avatar: exist_user.avatar
        }
        const token = jwt.sign(payload, secret, { expiresIn: '1h' })
        returnCtxBody(ctx, {
          code: 200,
          data: { token }
        })

      } else {
        returnCtxBody(ctx, {
          code: 400,
          error: '密码错误'
        })
      }
    } else {
      returnCtxBody(ctx, {
        code: 400,
        error: '邮箱不存在'
      })
    }

  },

  /**
   * 判断token，获取用户信息
   * @param  {object} ctx
   */
  async getInfo(ctx) {

    const token = ctx.query.token

    if (!token) {
      returnCtxBody(ctx, {
        code: 400,
        error: 'No Token'
      })
      return
    }

    // 验证token是否合法
    let is_ok = false
    let info = {}
    const secret = require('../../utils/config').secret
    jwt.verify(token, secret, {
      complete: true
    }, (error, decode) => {
      if (error) {
        const expiredAt = parseInt(new Date(error.expiredAt).getTime() / 1000);
        const allowTime = parseInt(new Date().getTime() / 1000) - parseInt(expiredAt);
        if (allowTime <= 60 * 60) {

          // ?失效60分钟内
          is_ok = false
        } else {
          is_ok = false
        }
      } else {
        is_ok = true
        info = decode.payload
      }
    })

    if (is_ok) {
      returnCtxBody(ctx, {
        code: 200,
        data: info
      })
    } else {
      returnCtxBody(ctx, {
        code: 400,
        error: 'Login failed, unable to get user details.'
      })
    }

  },

  /**
   * 获取选项配置信息
   * @param  {object} ctx
   */
  async getOptions(ctx) {
    // const user = User.find({}, '').lean()
    const name = ctx.query.name
    let data
    // !data test
    if (name === 'anime') {
      data = {
        type_name: ['正片', '电影', '其他'],
        tags: [
          '青春', '恋爱', '治愈', '催泪', '推理',
          '悬疑', '神魔', '妖怪', '科幻', '机战',
          '战争', '热血', '冒险'
        ],
        actor: ['未知'],
        staff: ['未知']
      }
    } else if (name === 'link') {
      data = {
        type_name: ['正片'],
        tags: []
      }
    }
    returnCtxBody(ctx, {
      code: 200,
      data,
      message: 'success'
    })
  },
  /**
   * 用户登出
   * @param  {object} ctx
   */
  async logout(ctx) {
    // todo
    returnCtxBody(ctx, {
      code: 200,
      message: 'success'
    })

  },

  /**
   * 用户注册
   * @param   {object} ctx
   */
  async signUp(ctx) {
    const exist_user = await User.find({
      email: ctx.request.body.email
    })
    if (exist_user.length > 0) {
      returnCtxBody(ctx, {
        code: 400,
        error: '邮箱重复'
      })
    } else {
      const newUser = new User({
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        avatar: gravatar.url(ctx.request.body.email, {
          s: '100',
          r: 'x',
          d: 'retro'
        }, true),
        password: md5(ctx.request.body.password)
      })
      await newUser.save()
        .then(() => {
          returnCtxBody(ctx, {
            code: 200
          })
        })
        .catch((error) => {
          returnCtxBody(ctx, {
            code: 400,
            error
          })
        })
    }
  }











}

