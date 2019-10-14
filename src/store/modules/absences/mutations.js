import * as types from '../../mutation-types'
import Vue from 'vue'

export const mutations = {
  [types.FETCH_ABSENCES] (state, data) {
    state.absences = data
  },
  [types.FETCH_ABSENCES_FOR_PROFILE] (state, { profileId, data }) {
    // change timestamps to date objects for easier handling in components
    for (let absence in data) {
      if (data.hasOwnProperty(absence)) {
        data[absence].startDate = new Date(data[absence].startDate)
        data[absence].endDate = data[absence].endDate ? new Date(data[absence].endDate) : null
      }
    }
    state.profile[profileId] = data
  },
  [types.ADD_ABSENCE] (state, { data, profileId }) {
    data.startDate = new Date(data.startDate)
    data.endDate = data.endDate ? new Date(data.endDate) : null
    state.profile[profileId] || Vue.set(state.profile, profileId, {})
    Vue.set(state.profile[profileId], data.id, data)
  },
  [types.UPDATE_ABSENCE] (state, data) {
    data.startDate = new Date(data.startDate)
    data.endDate = data.endDate ? new Date(data.endDate) : null
    Vue.set(state.profile[data.profileId], data.id, data)
  },
  [types.DELETE_ABSENCE] (state, { id, profileId }) {
    Vue.delete(state.profile[profileId], id)
  }
}
