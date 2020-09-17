import Axios from '@/services/Axios'
import Url from 'url'

export default {

  async getList() {
    return await Axios().get('./api/animes')
  },
  async add(anime) {
    return await Axios().post('./api/animes', anime)
  },
  async addFromUrl(url) {
    // maybe bad !!!
    const host = Url.parse(url).host.split('.').reverse()[1]
    return await Axios().get(`./${host}/animes`, {
      params: {
        url
      }
    })

  },
  async getDetail(id) {
    return await Axios().get(`./api/animes/${id}`)
  },
  async edit(anime, changes) {
    return await Axios().put(`./api/animes/${anime._id}`, {
      anime,
      changes
    })
  },
  async delete(id) {
    return await Axios().delete(`./api/animes/${id}`)
  },


}
