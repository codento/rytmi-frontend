import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'

const initialState = {
  profileId: localStorage.getItem('profile-id') || '',
  userProfile: '',
  profiles: {},
  profileList: [],
  profileSkills: [],
  profileProjectList: {},
  futurePpList: {}
}

export default {
  state: {...initialState},
  actions,
  getters,
  mutations
}
