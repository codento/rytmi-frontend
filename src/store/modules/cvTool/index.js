import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

const initialState = {
  cvIntroduction: '',
  cvOtherInfo: '',
  topSkills: [],
  topProjects: [],
  cvExportPending: false
}

export default {
  state: { ...initialState },
  getters,
  actions,
  mutations
}
