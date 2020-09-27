const moment = require('moment')
const url = require('url')
const Link = require('../../model/Link')
const SubLink = require('../../model/SubLink')

const returnCtxBody = require('./common').returnCtxBody

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
    returnCtxBody(ctx, {
      code: 200,
      data: links,
      message: 'success'
    })

  },

  /**
  * 获取Sub列表部分数据
  * @param  {object} ctx
  */
  async getListSub(ctx) {
    const links = await SubLink.find({},
      'link_path type_name tags add_date'
    ).populate('link_id', 'domain').lean()
    if (links.length > 0) {
      links.forEach((item) => {
        if (item.add_date) {
          item.add_date = moment(item.add_date).format('YYYY-MM-DD')
        }
        item.domain = url.resolve(item.link_id.domain, item.link_path)
      })
    }
    returnCtxBody(ctx, {
      code: 200,
      data: links,
      message: 'success'
    })

  },

  /**
   * 增加链接-添加域名
   * @param   {object} ctx
   */
  async add(ctx) {
    const ctx_link = ctx.request.body
    if (!ctx_link.domain) {
      returnCtxBody(ctx, {
        code: 400,
        error: '链接为空'
      })
      return
    }
    let url_parse = url.parse(ctx_link.domain)
    const hostname = url_parse.hostname
    const protocol = url_parse.protocol
    let domain = ''
    if (protocol && hostname) {
      domain = url.format({
        protocol: protocol,
        hostname: hostname
      })
    } else {
      returnCtxBody(ctx, {
        code: 400,
        error: '域名不合法'
      })
      return
    }
    const exist_domain = await Link.find({ domain })
    if (exist_domain.length > 0) {
      returnCtxBody(ctx, {
        code: 400,
        error: '域名重复'
      })
      return
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
          returnCtxBody(ctx, {
            code: 200,
            message: 'success'
          })
        })
        .catch((error) => {
          returnCtxBody(ctx, {
            code: 500,
            error
          })
        })
    }
  },

  /**
  * 增加链接-添加路径
  * @param   {object} ctx
  */
  async addSub(ctx) {
    const ctx_link = ctx.request.body
    if (!ctx_link.domain) {
      returnCtxBody(ctx, {
        code: 400,
        error: '链接为空'
      })
      return
    }
    let url_parse = url.parse(ctx_link.domain)
    const hostname = url_parse.hostname
    const protocol = url_parse.protocol
    const pathname = url_parse.pathname
    let domain = ''
    if (protocol && hostname) {
      domain = url.format({
        protocol: protocol,
        hostname: hostname
      })
    } else {
      returnCtxBody(ctx, {
        code: 400,
        error: '域名不合法'
      })
      return
    }

    const exist_domain = await Link.find({ domain })
    let link_id
    if (exist_domain.length == 0) {
      // 不存在-自动添加-获取id
      returnCtxBody(ctx, {
        code: 400,
        error: '未知域名，请添加域名'
      })
      /***
       * by add() !
       */
      const link = ctx_link
      const newLink = new Link({
        domain,
        type_name: link.type_name,
        favicon: `${domain}/favicon.ico`,
        add_date: new Date(),
      })
      await newLink.save()
        .then((link) => {
          link_id = link._id
        })
        .catch((error) => {
          returnCtxBody(ctx, {
            code: 500,
            error
          })
        })

    } else {
      // 存在域名-获取id
      link_id = exist_domain[0]._id
    }

    // 保存sub_link
    const exist_path = await SubLink.find({ link_path: pathname, link_id })
    if (exist_path.length > 0) {
      returnCtxBody(ctx, {
        code: 400,
        error: '路径重复'
      })
      return
    }
    // 保存
    const sub_link = ctx_link
    const newSubLink = new SubLink({
      link_id,
      link_path: pathname,
      type_name: sub_link.type_name,
      tags: sub_link.tags,
    })
    await newSubLink.save()
      .then(() => {
        returnCtxBody(ctx, {
          code: 200,
          message: 'success'
        })
      })
      .catch((error) => {
        returnCtxBody(ctx, {
          code: 400,
          error
        })
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
        returnCtxBody(ctx, {
          code: 500,
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
  * 修改Sub信息
  * @param  {object} ctx
  */
  async changeSub(ctx) {
    const new_link = ctx.request.body.link
    const changes = ctx.request.body.changes
    let updateFields = {}
    changes.forEach(i => {
      updateFields[i] = new_link[i]
    })

    await SubLink.updateMany({
      _id: ctx.params.id
    }, updateFields, error => {
      if (error) {
        returnCtxBody(ctx, {
          code: 500,
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
   * 查询详细信息
   * @param  {object} ctx
   */
  async getDetail(ctx) {
    await Link.findById(ctx.params.id).lean()
      .then(link => {
        if (link) {
          link.add_date = moment(link.add_date).format('YYYY-MM-DD')
          returnCtxBody(ctx, {
            code: 200,
            data: link,
            message: 'success'
          })
        } else {
          returnCtxBody(ctx, {
            code: 400,
            error: 'link_id not find'
          })
        }
      }).catch(error => {
        returnCtxBody(ctx, {
          code: 500,
          error
        })
      })
  },

  /**
   * 查询Sub详细信息
   * @param  {object} ctx
   */
  async getDetailSub(ctx) {
    await getDetail(ctx)
  }
}


