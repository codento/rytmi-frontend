import * as types from '../../mutation-types'
import Vue from 'vue'

export const mutations = {
  [types.FETCH_EMPLOYERS] (state, employers) {
    employers.forEach((employer) => {
      Vue.set(state.employers, employer.id, employer)
    })
  },
  [types.UPDATE_EMPLOYER] (state, employer) {
    Vue.set(state.employers, employer.id, employer)
  },
  [types.DELETE_EMPLOYER] (state, employer) {
    Vue.delete(state.employers, employer.id)
  }
}
