import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

const initialState = {
  cvIntroduction: '',
  cvOtherInfo: '',
  topSkills: [],
  topProjects: [],
  pdfDownloading: false,
  pdfDownloaded: '',
  pdfDownloadError: false
}

export default {
  state: { ...initialState },
  getters,
  actions,
  mutations
}
