import Vue from 'vue'
import Vuex from 'vuex'

import skills from './modules/skills'
import profiles from './modules/profiles'
Vue.use(Vuex)
const state = {
  loading: false
}
export default new Vuex.Store({
  state,
  modules: {
    skills,
    profiles
  }
})
