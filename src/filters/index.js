import Vue from 'vue'
import { format } from 'date-fns'

Vue.filter('dateFilter', value => {
  return value ? format(value, 'D.M.YYYY') : undefined
})
