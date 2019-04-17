export const skills = (state) => state.skills
export const skillById = (state) => (id) => state.skills[id]
export const skillName = (state) => (id) => state.skills[id].name
export const skillCategoryBySkillId = (state, getters, rootState, rootGetters) => (id) => {
  const category = getters.skillById(id) ? rootGetters.skillCategoryById(getters.skillById(id).skillCategoryId) : undefined
  return category
}
export const skillGroupBySkillId = (state, getters, rootState, rootGetters) => (id) => {
  const category = getters.skillCategoryBySkillId(id)
  const group = category ? rootGetters.skillGroupById(category.skillGroupId) : undefined
  return group
}
export const skillFilter = (state) => state.skillFilter
