const moment = require('moment')
const url = require('url')
const Link = require('../../model/Link')
const SubLink = require('../../model/SubLink')

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
   * 增加链接-添加域名
   * @param   {object} ctx
   */
  async add(ctx) {
    const ctx_link = ctx.request.body
    const ctx_link_url = ctx_link.domain
    const domain = 'http://' + url.parse(ctx_link_url).hostname
    const exist_domain = await Link.find({ domain })

    if (exist_domain.length > 0) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        error: '域名重复!'
      }
    } else {
      const link = ctx_link
      const newLink = new Link({
        domain,
        type_name: link.type_name,
        favicon: `${domain}/favicon.ico`,
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
  * 增加链接-添加路径
  * @param   {object} ctx
  */
  async addSub(ctx) {
    const ctx_link = ctx.request.body
    const ctx_link_url = ctx_link.domain
    const domain = 'http://' + url.parse(ctx_link_url).hostname
    const pathname = url.parse(ctx_link_url).pathname
    console.log(ctx_link_url);
    const exist_domain = await Link.find({ domain })
    let domain_id
    if (exist_domain.length == 0) {
      // 不存在-自动添加-获取id
      ctx.status = 400
      ctx.body = {
        code: 400,
        error: '未知域名!'
      }

    } else {
      // 存在域名-获取id
      domain_id = exist_domain[0]._id

    }
    // 保存sub_link
    const exist_path = await SubLink.find({ link_path: pathname }, { domain_id })
    if (exist_path.length > 0) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        error: '路径重复!'
      }
      return
    }
    // 保存
    const sub_link = ctx_link
    const newSubLink = new SubLink({
      domain_id,
      type_name: sub_link.type_name,
      tags: sub_link.tags,
      region: sub_link.region,
    })
    await newSubLink.save()
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
