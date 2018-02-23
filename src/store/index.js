import Vue from 'vue'
import Vuex from 'vuex'

import skills from './modules/skills'
import profiles from './modules/profiles'
import axios from 'axios'
Vue.use(Vuex)
const state = {
  loading: false,
  isAuthenticated: false,
  token: '',
  expiresIn: ''
}
export default new Vuex.Store({
  state,
  getters: {
    isAuthenticated: (state) => state.isAuthenticated
  },
  actions: {
    logout (context) {
      context.commit('logout')
    },
    login (context, idToken) {
      return new Promise((resolve, reject) => {
        axios.post(process.env.API_URL + '/auth', idToken)
          .then(response => {
            console.log('Backend response' + response.data)
            context.commit('login', response.data)
            resolve(response)
          }).catch(response => {
            console.log('Backend response' + response)
            reject(response)
          })
      })
    }
  },
  mutations: {
    logout (state) {
      state.token = ''
      state.expiresIn = ''
      state.isAuthenticated = false
    },
    login (state, data) {
      state.token = data.token.token
      state.expiresIn = data.token.expires
      state.isAuthenticated = true
    }
  },
  modules: {
    skills,
    profiles
  }
})
