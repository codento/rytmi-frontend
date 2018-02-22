export const profiles = (state) => state.profiles
export const profileById = (state) => (id) => state.profiles[id]
export const skillsByUserId = (state) => (userId) => {
  return state.profileSkillList
    .filter(skillId => state.profileSkills[skillId].profileId === userId)
    .map(skillId => state.profileSkills[skillId])
}
export const profileFilter = (state) => (param) => {
  let keys = Object.keys(state.profiles)
  let result = []
  for (var i = 0; i < keys.length; i++) {
    let name = state.profiles[keys[i]].firstName + ' ' + state.profiles[keys[i]].lastName
    if (name.toLowerCase().includes(param.toLowerCase())) {
      result.push(state.profiles[keys[i]])
    }
  }
  return result
}
