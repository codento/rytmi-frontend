import * as types from '../../mutation-types'
import Vue from 'vue'

export const mutations = {
  [types.FETCH_ABSENCES] (state, { profileId, data }) {
    // change timestamps to date objects to avoid avoid boilerplate in components
    for (let absence in data) {
      if (data.hasOwnProperty(absence)) {
        data[absence].startDate = new Date(data[absence].startDate)
        data[absence].endDate = new Date(data[absence].endDate)
      }
    }
    state.profile[profileId] = data
  },
  [types.ADD_ABSENCE] (state, { data, profileId }) {
    data.startDate = new Date(data.startDate)
    data.endDate = new Date(data.endDate)
    state.profile[profileId] || Vue.set(state.profile, profileId, {})
    Vue.set(state.profile[profileId], data.id, data)
  },
  [types.UPDATE_ABSENCE] (state, data) {
    data.startDate = new Date(data.startDate)
    data.endDate = new Date(data.endDate)
    Vue.set(state.profile[data.profileId], data.id, data)
  },
  [types.DELETE_ABSENCE] (state, { id, profileId }) {
    Vue.delete(state.profile[profileId], id)
  }
}
