import Vue from 'vue'
import Router from 'vue-router'
// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Profile from '@/views/Profile'
import EditProfile from '@/views/EditProfile'
import EditSkills from '@/views/EditSkills'
import Search from '@/views/Search'

import store from '../store'

Vue.use(Router)

const requireAuth = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/Dashboard',
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile,
          beforeEnter: requireAuth
        },
        {
          path: 'edit/:id',
          name: 'Edit Profile',
          component: EditProfile,
          beforeEnter: requireAuth
        },
        {
          path: 'editSkills',
          name: 'Edit Skills',
          component: EditSkills,
          beforeEnter: requireAuth
        },
        {
          path: 'search',
          name: 'Search',
          component: Search,
          beforeEnter: requireAuth
        }
      ]
    }
  ]
})
