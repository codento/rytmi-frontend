import Vue from 'vue'
import Vuex from 'vuex'

import skills from './modules/skills'
import profiles from './modules/profiles'

Vue.use(Vuex)

// TODO figure out what global state is needed
const state = {
  loading: false
}

export default new Vuex.Store({
  modules: {
    ...state,
    skills,
    profiles
  }
})
