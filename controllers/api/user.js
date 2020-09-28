const gravatar = require('gravatar')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const User = require('../../model/User')
const returnCtxBody = require('../../utils/api').returnCtxBody

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}
const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}


module.exports = {

  /**
   * 用户登录
   * @param  {object} ctx
   */
  async signIn(ctx) {

    const { username } = ctx.request.body
    const token = tokens[username]

    // mock error
    if (!token) {
      ctx.body = {
        code: 400,
        message: 'Account and password are incorrect.'
      }
    }

    ctx.body = {
      code: 200,
      data: token
    }
  },

  /**
   * 用户信息
   * @param  {object} ctx
   */
  async getInfo(ctx) {

    const token = ctx.query.token
    console.log(token);
    const info = users[token]

    // mock error
    if (!info) {
      ctx.body = {
        code: 400,
        message: 'Login failed, unable to get user details.'
      }
    }

    ctx.body = {
      code: 200,
      data: info
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
    // data test
    if (name == 'anime') {
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
    } else if (name == 'link') {
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
    const find_arr = await User.find({
      email: ctx.request.body.email
    })
    if (find_arr.length > 0) {
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








  /*
      const exist_user = await User.findOne({
        email: ctx.request.body.email
      })
      if (exist_user) {
        if (find_one.password === md5(ctx.request.body.password)) {
          const user = {
            id: find_one.id,
            name: find_one.name,
            avatar: find_one.avatar
          }
          const key = 'animehub'
          // token
          const token = jwt.sign(user, key, {
            expiresIn: 3600
          })

          ctx.status = 200
          ctx.body = {
            status: '1',
            data: {
              user: user
            },
            token: "Bearer " + token
          }
        } else {
          ctx.status = 400
          ctx.body = {
            error: '密码错误!',
            status: '-1'
          }
        }
      } else {
        ctx.status = 400
        ctx.body = {
          status: '-1',
          error: '邮箱不存在!'
        }
      }*/

}

