export const skills = (state) => state.skills
export const skillById = (state) => (id) => state.skills[id]
export const skillName = (state) => (id) => state.skills[id].name
export const skillFilter = (state) => state.skillFilter
