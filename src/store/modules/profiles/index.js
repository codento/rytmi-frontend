import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'

const initialState = {
  profileId: window.localStorage ? parseInt(window.localStorage.getItem('profile-id')) || undefined : undefined,
  userProfile: '',
  profiles: {},
  profileList: [],
  profileSkills: [],
  profileProjectList: {},
  futurePpList: {}
}

export default {
  state: { ...initialState },
  actions,
  getters,
  mutations
}
