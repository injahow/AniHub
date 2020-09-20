const gravatar = require('gravatar')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const User = require('../../model/User')

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
  async signIn(ctx) {//'/vue-admin-template/user/login',

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
  async getInfo(ctx) {//'/vue-admin-template/user/login',

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
   * 用户登出
   * @param  {object} ctx
   */
  async logout(ctx) {

    ctx.body = {
      code: 200,
      data: 'success'
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

/**
 * 用户注册
 * @param   {object} ctx
 */
/*
async signUp(ctx) {


/*
    const find_arr = await User.find({
      email: ctx.request.body.email
    })
    if (find_arr.length > 0) {
      ctx.status = 400
      ctx.body = {
        status: '-1',
        error: '邮箱重复!'
      }
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
          ctx.status = 200
          ctx.body = {
            status: '1'
          }
        })
        .catch((error) => {
          ctx.status = 400
          ctx.body = {
            status: '-1',
            error
          }
        })
    }

}
}*/
