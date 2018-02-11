import * as types from '../../mutation-types'

export const mutations = {
  [types.FETCH_PROFILES] (state, profiles) {
    state.profiles = profiles
  },
  [types.UPDATE_PROFILELIST] (state) {
    state.profileList = Object.keys(state.profiles)
  },
  [types.UPDATE_PROFILE] (state, profile) {
  }
}
