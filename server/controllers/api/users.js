const gravatar = require('gravatar');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const User = require('../../model/User');

module.exports = {

  /**
   * 用户登录
   * @param  {obejct} ctx
   */
  async signIn(ctx) {

    const exist_user = await User.findOne({
      email: ctx.request.body.email
    });
    if (exist_user) {
      if (find_one.password === md5(ctx.request.body.password)) {
        const user = {
          id: find_one.id,
          name: find_one.name,
          avater: find_one.avater
        };
        const key = 'animehub';
        // token
        const token = jwt.sign(user, key, {
          expiresIn: 3600
        })

        ctx.status = 200;
        ctx.body = {
          status: '1',
          data: {
            user: user
          },
          token: "Bearer " + token
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          error: '密码错误!',
          status: '-1'
        }
      }
    } else {
      ctx.status = 400;
      ctx.body = {
        status: '-1',
        error: '邮箱不存在!'
      };
    }

  },

  /**
   * 用户注册
   * @param   {obejct} ctx
   */
  async signUp(ctx) {

    const find_arr = await User.find({
      email: ctx.request.body.email
    });
    if (find_arr.length > 0) {
      ctx.status = 400;
      ctx.body = {
        status: '-1',
        error: '邮箱重复!'
      };
    } else {
      const newUser = new User({
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        avater: gravatar.url(ctx.request.body.email, {
          s: '100',
          r: 'x',
          d: 'retro'
        }, true),
        password: md5(ctx.request.body.password)
      });
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
        });
    }

  }


}
