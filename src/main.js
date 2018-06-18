// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './store'
import lodash from 'lodash'
import Toasted from 'vue-toasted'
import Loading from './components/lib/loading'

import 'date-input-polyfill'

Object.defineProperty(Vue.prototype, '$lodash', { value: lodash })
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App
  }
})
