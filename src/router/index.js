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
import Skills from '@/views/Skills'

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
  mode: 'history',
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
      path: '/projects',
      name: 'projects',
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
      path: '/edit/:profileId',
      name: 'editProfile',
      component: EditProfile,
      props: true
    },
    {
      path: '/skills',
      name: 'Skills',
      component: Skills,
      props: true
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
