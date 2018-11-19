import * as types from './mutation-types'

export default {
  [types.SET_LOADING] (state, boolean) {
    state.loading = boolean
  },
  [types.SET_APP_INITIALIZED] (state, boolean) {
    state.appInitialized = boolean
  },
  [types.SET_APP_INITIALIZE_ERROR] (state, error) {
    state.appInitializeError = error
  }
}
