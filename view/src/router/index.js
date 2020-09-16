import Vue from 'vue'
import Router from 'vue-router'

import User from '@/components/user'
import Anime from '@/components/anime'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/anime',
      name: 'Anime',
      component: Anime
    }
  ]
})
