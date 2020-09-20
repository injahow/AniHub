const got = require('got')

module.exports = {

  /**
   * 获取动漫信息
   * @param {Object} ctx
   */
  async getAnimeDetail(ctx) {
    const url = ctx.request.query.url
    // need to optimize ......
    const re = [
      /bilibili.com\/bangumi\/media\/md\d+/g,
      /bilibili.com\/bangumi\/play\/ss\d+/g,
      /bilibili.com\/bangumi\/play\/ep\d+/g
    ]
    let result = ''
    let result_temp = []
    let result_id = 0
    re.forEach((re_i, i) => {
      let temp = re_i.exec(url)
      if (temp) {
        result_temp.push(temp)
        result_id = i
      }
    })

    if (result_id !== 0) { // not md... => md...
      const res = await got(`https://www.${result_temp.toString()}`)
      result = re[0].exec(res.body)
    } else {
      result = result_temp
    }

    if (result) {
      try {
        const response = await got(`https://www.${result.toString()}`)
        const obj = await response.body.match(/__INITIAL_STATE__[^#]+function/g).toString()
        const mediaInfo = JSON.parse(obj.substring(18, obj.length - 10)).mediaInfo

        let tags = []
        mediaInfo.styles.forEach((i) => {
          tags.push(i.name)
        })
        //const type_name = mediaInfo.type_name
        if (mediaInfo.cover[4] == 's') { // 改为http 绕过防盗链
          mediaInfo.cover = mediaInfo.cover.replace('https', 'http')
        }

        const anime = {
          name: mediaInfo.title,
          cover: mediaInfo.cover,
          introduction: mediaInfo.evaluate,
          tags: tags,
          actor: mediaInfo.actors.split('\n'),
          staff: mediaInfo.staff.split('\n'),
          region: mediaInfo.areas[0].name,
          publish: mediaInfo.publish.pub_date
        }

        ctx.status = 200
        ctx.body = {
          code: 200,
          data: anime
        }
      } catch (error) {
        ctx.status = 500
        ctx.body = {
          code: 500,
          error
        }
      }
    } else {
      ctx.status = 406
      ctx.body = {
        code: 406,
        error: 'params "url" error'
      }
    }
  }

}
