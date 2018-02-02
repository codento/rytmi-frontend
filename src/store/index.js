import Vue from 'vue'
import Vuex from 'vuex'
import skills from './modules/skills'
import profiles from './modules/profiles'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    skills,
    profiles
  }
})
