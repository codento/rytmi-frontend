export const profileId = (state) => state.profileId
export const profiles = (state) => state.profiles
export const profileById = (state) => (id) => state.profiles[id]
export const skillsByProfileId = (state) => (profileId) => {
  return state.profileSkills
    .filter(skill => skill.profileId === profileId)
    .sort((a, b) => { return a.id - b.id })
}
export const profileFilter = (state) => (param) => {
  let keys = Object.keys(state.profiles)
  let result = []
  for (var i = 0; i < keys.length; i++) {
    let name = state.profiles[keys[i]].firstName + ' ' + state.profiles[keys[i]].lastName
    if (name.toLowerCase().includes(param.toLowerCase()) && state.profiles[keys[i]].active) {
      result.push(state.profiles[keys[i]])
    }
  }
  return result
}
