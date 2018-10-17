import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const initialState = {
  profileProjects: {},
  profileProjectsStatus: null
}

export default {
  state: { ...initialState },
  actions,
  getters,
  mutations
}
