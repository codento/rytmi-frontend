import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/views/LandingPage'
import Profile from '@/views/Profile'
import EditProfile from '@/views/EditProfile'
import Search from '@/views/Search'
import PageNotFound from '@/views/PageNotFound'
import store from '../store'
import Callback from '@/components/helpers/Callback'
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
      name: 'root',
      redirect: '/home',
      component: LandingPage
    },
    {
      path: '/home',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: Profile,
      beforeEnter: requireAuth
    },
    {
      path: '/profile/:id/edit',
      name: 'editProfile',
      component: EditProfile
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      beforeEnter: requireAuth
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback,
      beforeEnter: requireAuth
    },
    {
      path: '/*',
      component: PageNotFound
    }
  ]
})
