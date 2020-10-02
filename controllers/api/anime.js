const pinyin = require('pinyin')
const moment = require('moment')

const Anime = require('../../model/Anime')
const { returnCtxBody } = require('../../utils/api')

module.exports = {

  /**
   * 获取列表部分数据
   * @param  {object} ctx
   */
  async getList(ctx) {
    let animes = await Anime.find({}, 'name cover tags region publish').lean()
    if (animes.length > 0) {
      animes.forEach((item) => {
        if (item.publish) {
          item.publish = moment(item.publish).format('YYYY-MM')
        }
      })
    }
    returnCtxBody(ctx, {
      code: 200,
      data: animes,
      message: 'success'
    })
  },

  /**
  * 按规则搜索数据
  * @param  {object} ctx
  */
  async getIndex(ctx) {
    let form = ctx.request.body
    let rules
    if (form) {
      // key -> type? region publish! tags
      rules = form
      for (let key in form) {
        if (form[key] === '全部') {
          delete rules[key]
        }
      }
      if ('publish' in rules) {
        const year = parseInt(rules['publish'])
        rules['publish'] = {
          "$gte": new Date(year, 0, 0, 0, 0, 0).toISOString(),
          "$lt": new Date(year + 1, 0, 0, 0, 0, 0).toISOString()
        }
      }
    } else {
      rules = {}
    }

    let animes = await Anime.find(rules, 'name cover tags region publish', { limit: 50 }).lean()

    if (animes.length > 0) {
      animes.forEach((item) => {
        if (item.publish) {
          item.publish = moment(item.publish).format('YYYY-MM')
        }
      })
    }
    returnCtxBody(ctx, {
      code: 200,
      data: animes,
      message: 'success'
    })
  },

  /**
  * 按名称搜索
  * @param  {object} ctx
  */
  async search(ctx) {
    const name = ctx.request.query.name
    let animes
    if (name !== '') {
      const rules = { 'name': eval(`/${name}/i`) }
      animes = await Anime.find(rules, 'name cover tags region publish', { limit: 50 }).lean()
      if (animes.length > 0) {
        animes.forEach((item) => {
          if (item.publish) {
            item.publish = moment(item.publish).format('YYYY-MM')
          }
        })
      }
    } else {
      animes = []
    }
    returnCtxBody(ctx, {
      code: 200,
      data: animes,
      message: 'success'
    })
  },

  /**
   * 增加数据操作
   * @param   {object} ctx
   */
  async add(ctx) {
    const anime = ctx.request.body
    const exist_name = await Anime.find({
      name: anime.name
    })
    if (exist_name.length > 0) {
      returnCtxBody(ctx, {
        code: 400,
        error: '名称重复'
      })
    } else {
      const newAnime = new Anime({
        name: anime.name,
        type_name: anime.type_name,
        cover: anime.cover,
        pinyin: pinyin(anime.name, {
          style: pinyin.STYLE_INITIALS
        }),
        tags: anime.tags,
        staff: anime.staff,
        actor: anime.actor,
        introduction: anime.introduction,
        publish: anime.publish,
        region: anime.region,
      })
      await newAnime.save()
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
    }
  },

  /**
   * 删除信息
   * @param    {object} ctx
   */
  async delete(ctx) {
    await Anime.deleteOne({
      _id: ctx.params.id
    }, error => {
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
   * 修改信息
   * @param  {object} ctx
   */
  async change(ctx) {
    const new_anime = ctx.request.body.anime
    const changes = ctx.request.body.changes
    let updateFields = {}
    changes.forEach((i) => {
      updateFields[i] = new_anime[i]
    })

    await Anime.updateMany({
      _id: ctx.params.id
    }, updateFields, function (error) {
      if (error) {
        returnCtxBody(ctx, {
          code: 400,
          error
        })
      } else {
        returnCtxBody(ctx, {
          code: 200
        })
      }
    })
  },

  /**
   * 查询详细信息
   * @param  {object} ctx
   */
  async getDetail(ctx) {
    await Anime.findById(ctx.params.id).lean()
      .then((anime) => {
        if (anime) {
          anime.publish = moment(anime.publish).format('YYYY-MM')
          returnCtxBody(ctx, {
            code: 200,
            data: anime
          })

        } else {
          returnCtxBody(ctx, {
            code: 400,
            error: 'anime_id not found'
          })
        }
      }).catch((error) => {
        returnCtxBody(ctx, {
          code: 500,
          error
        })
      })
  }

}
