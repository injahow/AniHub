const moment = require('moment')

const Link = require('../../model/Link')

module.exports = {

  /**
   * 获取列表部分数据
   * @param  {object} ctx
   */
  async getList(ctx) {
    let links = await Link.find({}, 'domain favicon type_name tags region add_date').lean()
    if (links.length > 0) {
      links.forEach((item) => {
        if (item.add_date) {
          item.add_date = moment(item.add_date).format('YYYY-MM-DD')
        }
      })
    }
    ctx.status = 200
    ctx.body = {
      code: 200,
      data: links,
      message: 'success'
    }
  },

  /**
   * 增加数据操作
   * @param   {object} ctx
   */
  async add(ctx) {
    const exist_domain = await Link.find({
      domain: ctx.request.body.domain
    })
    if (exist_domain.length > 0) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        error: '域名重复!'
      }
    } else {
      const link = ctx.request.body
      const newLink = new Link({
        domain: link.domain,
        type_name: link.type_name,
        favicon: `${link.domain}/favicon.ico`,
        tags: link.tags,
        add_date: new Date(),
        region: link.region,
      })
      await newLink.save()
        .then(() => {
          ctx.status = 200
          ctx.body = {
            code: 200,
            message: 'success'
          }
        })
        .catch((error) => {
          ctx.status = 400
          ctx.body = {
            code: 400,
            error
          }
        })
    }
  },

  /**
   * 修改信息
   * @param  {object} ctx
   */
  async change(ctx) {
    const new_link = ctx.request.body.link
    const changes = ctx.request.body.changes
    let updateFields = {}
    changes.forEach(i => {
      updateFields[i] = new_link[i]
    })

    await Link.updateMany({
      _id: ctx.params.id
    }, updateFields, error => {
      if (error) {
        ctx.status = 400
        ctx.body = {
          code: 400,
          error
        }
      } else {
        ctx.status = 200
        ctx.body = {
          code: 200,
          message: 'success'
        }
      }
    })
  },

  /**
   * 查询详细信息
   * @param  {object} ctx
   */
  async getDetail(ctx) {
    await Link.findById(ctx.params.id).lean()
      .then(link => {
        if (link) {
          link.add_date = moment(link.add_date).format('YYYY-MM-DD')
          ctx.status = 200
          ctx.body = {
            code: 200,
            data: link
          }
        } else {
          ctx.status = 400
          ctx.body = {
            code: 400,
            error: 'link_id not find',
          }
        }
      }).catch(error => {
        ctx.status = 500
        ctx.body = {
          code: 500,
          error
        }
      })
  }
}
