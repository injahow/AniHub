const got = require('got')

module.exports = {

  /**
   * 获取动漫信息
   * @param {Object} ctx
   */
  async getAnimeDetail(ctx) {
    const url = ctx.request.query.url
    //console.log(url)
    const re = /bilibili.com\/bangumi\/media\/md\d+/g
    const result = re.exec(url)
    if (result) {
      try {

        const response = await got(`https://www.${result.toString()}`)

        let obj = await response.body.match(/__INITIAL_STATE__[^#]+function/g).toString()
        obj = JSON.parse(obj.substring(18, obj.length - 10)).mediaInfo

        let tags = []
        obj.styles.forEach((i) => {
          tags.push(i.name)
        })
        const region = obj.type_name == '番剧' ? '日本' : ''
        if (obj.cover[4] == 's') { // 改为http 绕过防盗链
          obj.cover = obj.cover.replace('https', 'http')
        }

        const anime = {
          name: obj.title,
          cover: obj.cover,
          introduction: obj.evaluate,
          tags: tags,
          actor: obj.actors.split('\n'),
          staff: obj.staff.split('\n'),
          region: region,
          publish: obj.publish.pub_date
        }
        ctx.status = 200
        ctx.body = anime
      } catch (error) {
        ctx.status = 500
        ctx.body = {
          error
        }
      }
    } else {
      ctx.status = 406
      ctx.body = {
        error: 'params \'url\' error'
      }
    }
  }

}
