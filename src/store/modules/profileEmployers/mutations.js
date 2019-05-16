import * as types from '../../mutation-types'

export const mutations = {
  [types.FETCH_PROFILEEMPLOYERS] (state, profileEmployers) {
    state.profileEmployers = profileEmployers
  }
}
