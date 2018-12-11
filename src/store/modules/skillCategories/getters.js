export const skillCategories = (state) => state.skillCategories
export const skillCategoryById = (state) => (id) => state.skillCategories[id]
export const skillCategoryTitle = (state) => (id) => state.skillCategories[id].title
