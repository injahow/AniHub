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
    const user_id = ctx.params.id
    const name = ctx.query.name
    let select_str
    if (name === 'anime') {
      select_str = 'anime_options'
    } else if (name === 'link') {
      select_str = 'link_options'
    } else if (name === 'sublink') {
      select_str = 'sublink_options'
    }

    let obj = await User.findById(user_id, select_str)
    data = obj[select_str]

    if (data) {
      returnCtxBody(ctx, {
        code: 200,
        data: data,
        message: 'success'
      })
    } else {
      returnCtxBody(ctx, {
        code: 500
      })
    }

  },

  /**
   * 选择修改选项配置信息
   * @param  {object} ctx
   */
  async editOptions(ctx) {
    const user_id = ctx.params.id

    const name = ctx.request.body.name
    const new_options = ctx.request.body.options

    let updateFields = {}
    if (name === 'anime') {
      select_str = 'anime_options'
    } else if (name === 'link') {
      select_str = 'link_options'
    } else if (name === 'sublink') {
      select_str = 'sublink_options'
    }
    updateFields[select_str] = new_options

    await User.updateMany({
      _id: user_id
    }, updateFields, error => {
      if (error) {
        returnCtxBody(ctx, {
          code: 400,
          error
        })
      } else {
        returnCtxBody(ctx, {
          code: 200,
          message: 'success'
        })
      }
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

