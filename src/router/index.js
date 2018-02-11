import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Profile from '@/views/Profile'
import EditProfile from '@/views/EditProfile'
import EditSkills from '@/views/EditSkills'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
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
          component: Profile
        },
        {
          path: 'edit/:id',
          name: 'Edit Profile',
          component: EditProfile
        },
        {
          path: 'editSkills',
          name: 'Edit Skills',
          component: EditSkills
        }
      ]
    }
  ]
})
