export const skills = (state) => state.skills
export const skillById = (state) => (id) => state.skills[id]
export const skillsNotIn = (state) => (array) => {
  let skills = Object.assign({}, state.skills)
  for (var i = 0; i < array.length; i++) {
    for (var skill in skills) {
      if (array[i].id === skills[skill].id) {
        delete skills[skill]
      }
    }
  }
  return skills
}
