import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import Typography from 'src/components/Dashboard/Views/Typography.vue'
import Icons from 'src/components/Dashboard/Views/Icons.vue'
import UserProfile from 'src/components/Dashboard/Views/UserProfile.vue'
import TableList from 'src/components/Dashboard/Views/TableList.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/overview'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/stats',
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: Overview
      },
      {
        path: 'typography',
        name: 'typography',
        component: Typography
      },
      {
        path: 'icons',
        name: 'icons',
        component: Icons
      },
      {
        path: 'userprofile',
        name: 'userprofile',
        component: UserProfile
      },
      {
        path: 'tablelist',
        name: 'tablelist',
        component: TableList
      }
    ]
  },
  { path: '*', component: NotFound }
]

export default routes
