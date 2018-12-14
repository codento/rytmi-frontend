// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
import 'date-input-polyfill'

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'

import ErrorPage from '@/views/ErrorPage'

import store from './store'
import Toasted from 'vue-toasted'
import Loading from './components/helpers/LoadingSpinner'

Vue.use(BootstrapVue)
Vue.use(Toasted)

Vue.component('loading', Loading)

const options = {
  theme: 'bubble',
  position: 'top-right',
  duration: 5000
}
Vue.toasted.register('rytmi_success', (payload) => {
  if (!payload.message) {
    return 'Success'
  }
  return payload.message
}, {
  type: 'success',
  ...options
})

Vue.toasted.register('rytmi_error', (payload) => {
  if (!payload.message) {
    return 'Oops.. Something Went Wrong..'
  }
  return 'Oops.. ' + payload.message
}, {
  type: 'error',
  ...options
})

function renderWithError () {
  new Vue({ // eslint-disable-line no-new
    el: '#app',
    components: {
      ErrorPage
    },
    template: '<ErrorPage/>'
  })
}

function gapiInit () {
  return gapi.auth2.init({
    client_id: process.env.VUE_APP_CLIENT_ID,
    cookiepolicy: 'single_host_origin',
    scope: 'profile'
  }).then((response) => {
    if (response && !response.hasOwnProperty('error')) {
      new Vue({ // eslint-disable-line no-new
        el: '#app',
        store,
        router,
        components: {
          App
        },
        template: '<App/>'
      })
    } else {
      renderWithError()
    }
  })
}

if (typeof gapi === 'object') {
  gapi.load('auth2', gapiInit)
} else {
  renderWithError()
}
