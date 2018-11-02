
export const getters = {
  futureProjectsOfProfile: (state, getters, rootState) => (profileId) => {
    const ppIds = state.futurePpList[profileId] || []
    return ppIds
      .map(ppId => rootState.profileProjects.profileProjects[ppId])
  },
  profileId: (state) => state.profileId,
  profiles: (state) => state.profiles,
  profileById: (state) => (id) => state.profiles[id],
  projectsOfProfile: (state, getters, rootState) => (profileId) => state.profileProjectList[profileId].map(id => rootState.profileProjects.profileProjects[id]),
  skillsByProfileId: (state, getters) => (profileId) => {
    return state.profileSkills
      .filter(skill => skill.profileId === profileId)
      .sort((a, b) => {
        const nameA = getters.skillName(a.skillId).toLowerCase()
        const nameB = getters.skillName(b.skillId).toLowerCase()
        if (nameA < nameB) return -1
        else if (nameA > nameB) return 1
        return 0
      })
  },
  profileFilter: (state) => (param) => {
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
}
