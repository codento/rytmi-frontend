import Vue from 'vue'
import Vuex from 'vuex'
import skills from './modules/skills'
import profiles from './modules/profiles'
import auth from './modules/auth'
import projects from './modules/projects'
import profileProjects from './modules/profileProjects'
import skillCategories from './modules/skillCategories'
import skillGroups from './modules/skillGroups'
import employeeRoles from './modules/employeeRoles'
import users from './modules/users'
import siteSettings from './modules/siteSettings'
import cvTool from './modules/cvTool'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)
const state = {
  loading: false,
  token: null,
  appInitialized: false,
  appInitializeError: null
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  modules: {
    skills,
    profiles,
    auth,
    projects,
    profileProjects,
    skillCategories,
    skillGroups,
    employeeRoles,
    users,
    siteSettings,
    cvTool
  }
})
