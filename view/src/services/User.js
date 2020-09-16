import Api from '@/services/Api'

export default {

  async join() {
    return await Api().post('./users/join')
  },
  async login() {
    return await Api().post('./users/login')
  }

}
