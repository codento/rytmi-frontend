import * as actions from './actions'
import * as getters from './getters'
import { mutations } from './mutations'

const initialState = {
  skillCategories: {},
  skillCategoryList: []
}

export default {
  state: { ...initialState },
  actions,
  getters,
  mutations
}
