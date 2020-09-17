import Axios from '@/services/Axios'

export default {

  async join(user) {
    return await Axios().post('./users/join', user)
  },
  async login(user) {
    return await Axios().post('./users/login', user)
  }

}
