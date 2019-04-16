import * as actions from './actions'
import getters from './getters'
import { mutations } from './mutations'

const initialState = {
  employers: {}
}

export default {
  state: { ...initialState },
  actions,
  getters,
  mutations
}
