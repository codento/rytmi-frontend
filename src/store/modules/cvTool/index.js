import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

const initialState = {
  cvIntroduction: '',
  keySkills: [],
  recentProjects: [],
  cvExportPending: false,
  url: ''
}

export default {
  state: { ...initialState },
  getters,
  actions,
  mutations
}
