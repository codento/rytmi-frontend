import * as actions from './actions'
import getters from './getters'
import { mutations } from './mutations'

const initialState = {
  profileEmployers: {}
}

export default {
  state: { ...initialState },
  actions,
  getters,
  mutations
}
