import * as actions from './actions'
import getters from './getters'
import { mutations } from './mutations'

const initialState = {
  projects: {},
  projectList: [],
  profileProjectList: {}
}

export default {
  state: { ...initialState },
  actions,
  getters,
  mutations
}
