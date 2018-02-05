import * as types from './mutation-types'

export const mutations = {
  [types.SET_LOADING] (state, boolean) {
    state.loading = boolean
  }
}
