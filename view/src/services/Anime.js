import Axios from '@/services/Axios'

export default {

  async getList() {
    return await Axios().get('./animes')
  },
  async add(anime) {
    return await Axios().post('./animes', anime)
  },
  async getDetail(id) {
    return await Axios().get(`./animes/${id}`)
  },
  async edit(anime, changes) {
    return await Axios().put(`./animes/${anime._id}`, {
      anime,
      changes
    })
  },
  async delete(id) {
    return await Axios().delete(`./animes/${id}`)
  }


}
