import Vue from 'vue'
import Vuex from 'vuex'

import skills from './modules/skills'
import profiles from './modules/profiles'
import axios from 'axios'
Vue.use(Vuex)

// TODO figure out what global state is needed
const state = {
  loading: false,
  isAuthenticated: false
}

export default new Vuex.Store({
  getters: {
    isAuthenticated: (state) => {
      return state.isAuthenticated
    }
  },
  actions: {
    logout (context) {
      context.commit('logout')
    },
    login (context, credentials) {
      axios.post('/login', credentials)
        .then(response => {
          context.commit('login', response.data)
        }).catch(response => {
          window.alert('Could not login!')
        })
    }
  },
  mutations: {
    logout (state) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', null)
        window.localStorage.setItem('tokenExpiration', null)
      }
      state.isAuthenticated = false
    },
    login (state, token) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', token.token)
        window.localStorage.setItem('tokenExpiration', token.expiration)
      }
      state.isAuthenticated = true
    }
  },
  modules: {
    ...state,
    skills,
    profiles
  }
})
