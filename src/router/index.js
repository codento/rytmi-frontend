import Vue from 'vue'
import Router from 'vue-router'
// Containers

// Views
import Login from '@/views/Login'
import Profile from '@/views/Profile'
import EditProfile from '@/views/EditProfile'
import Search from '@/views/Search'
import PageNotFound from '@/views/PageNotFound'
import store from '../store'

Vue.use(Router)

const requireAuth = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next({
      path: '/unauth',
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
      name: 'Home',
      redirect: '/home',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Login
    },
    {
      path: '/profile/:id',
      name: 'Profile',
      component: Profile,
      beforeEnter: requireAuth
    },
    {
      path: '/edit/:id',
      name: 'Edit',
      component: EditProfile
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      beforeEnter: requireAuth
    },
    {
      path: '/*',
      component: PageNotFound
    }
  ]
})
