import Vue from 'vue'
import Router from 'vue-router'

import User from '@/components/user'
import Anime from '@/components/anime'
import AnimeAdd from '@/components/anime/add'
import AnimeEdit from '@/components/anime/edit'
import AnimeDetail from '@/components/anime/detail'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/anime',
      name: 'anime',
      component: Anime
    },
    {
      path: '/anime/add',
      name: 'anime_add',
      component: AnimeAdd
    },
    {
      path: '/anime/:id',
      name: 'anime_detail',
      component: AnimeDetail
    },
    {
      path: '/anime/edit/:id',
      name: 'anime_edit',
      component: AnimeEdit
    }

  ]
})
