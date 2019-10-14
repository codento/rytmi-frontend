import * as actions from './actions'
import * as getters from './getters'
import { mutations } from './mutations'

const initialState = {
  profile: {},
  absences: {}
}

export default {
  state: { ...initialState },
  actions,
  getters,
  mutations
}
