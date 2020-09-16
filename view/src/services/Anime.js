import Api from '@/services/Api'

export default {

  async getList() {
    return await Api().get('./animes')
  },
  async add() {
    return await Api().post('./animes')
  },
  async getDetail(id) {
    return await Api().get(`./animes/${id}`)
  },
  async edit(id) {
    return await Api().post(`./animes/${id}`)
  },
  async delete(id) {
    return await Api().delete(`./animes/${id}`)
  }


}
