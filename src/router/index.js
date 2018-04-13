import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/views/LandingPage'
import Profile from '@/views/Profile'
import EditProfile from '@/views/EditProfile'
import Search from '@/views/Search'
import PageNotFound from '@/views/PageNotFound'
import store from '../store'
import Callback from '@/components/helpers/Callback'
import Projects from '@/views/Projects'
import Project from '@/views/Project'
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
      component: LandingPage
    },
    {
      path: '/home',
      name: 'Home',
      component: LandingPage
    },
    {
      path: '/profile/:id',
      name: 'Profile',
      component: Profile,
      beforeEnter: requireAuth
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects,
      beforeEnter: requireAuth
    },
    {
      path: '/projects/:id',
      name: 'Project',
      component: Project,
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
      path: '/callback',
      name: 'Callback',
      component: Callback,
      beforeEnter: requireAuth
    },
    {
      path: '/*',
      component: PageNotFound
    }
  ]
})
