import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Profile from '@/views/Profile'
import EditProfile from '@/views/EditProfile'
import EditSkills from '@/views/EditSkills'
import Search from '@/views/Search'
import Login from '@/views/Login'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/login',
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          beforeEnter: (to, from, next) => {
            if (!store.getters.isAuthenticated) {
              next({
                path: '/login',
                query: { redirect: to.fullPath }
              })
            } else {
              next()
            }
          }
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile,
          beforeEnter: (to, from, next) => {
            if (!store.getters.isAuthenticated) {
              next({
                path: '/login',
                query: { redirect: to.fullPath }
              })
            } else {
              next()
            }
          }
        },
        {
          path: 'edit/:id',
          name: 'Edit Profile',
          component: EditProfile,
          beforeEnter: (to, from, next) => {
            if (!store.getters.isAuthenticated) {
              next({
                path: '/login',
                query: { redirect: to.fullPath }
              })
            } else {
              next()
            }
          }
        },
        {
          path: 'editSkills',
          name: 'Edit Skills',
          component: EditSkills,
          beforeEnter: (to, from, next) => {
            if (!store.getters.isAuthenticated) {
              next({
                path: '/login',
                query: { redirect: to.fullPath }
              })
            } else {
              next()
            }
          }
        },
        {
          path: 'search',
          name: 'Search',
          component: Search
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        }
      ]
    }
  ]
})
