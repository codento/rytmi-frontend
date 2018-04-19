import Vue from 'vue'
import Vuex from 'vuex'

import skills from './modules/skills'
import profiles from './modules/profiles'
import auth from './modules/auth'
import projects from './modules/projects'

Vue.use(Vuex)
const state = {
  loading: false,
  token: null
}
export default new Vuex.Store({
  state,
  modules: {
    skills,
    profiles,
    auth,
    projects
  }
})
