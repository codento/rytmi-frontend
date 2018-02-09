export const profiles = (state) => state.profiles
export const profileById = (state) => (id) => state.profiles[id]
export const skillsByUserId = (state) => (userId) => {
  return state.profileSkillList
    .filter(skillId => state.profileSkills[skillId].profileId === userId)
    .map(skillId => state.profileSkills[skillId])
}
