// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './store'
import lodash from 'lodash'
import Toasted from 'vue-toasted'

Object.defineProperty(Vue.prototype, '$lodash', { value: lodash })
Vue.use(BootstrapVue)
Vue.use(Toasted)
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
