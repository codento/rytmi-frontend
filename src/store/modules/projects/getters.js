import { cloneDeep } from 'lodash'

export default {
  projects: (state) => state.projects,
  projectById: (state, getters, rootState) => (id) => {
    let project = cloneDeep(state.projects[id])
    if (project) {
      const descriptions = project.descriptions
        .find(description => description.language === rootState.siteSettings.currentLanguage)
      project = Object.assign(project, { description: descriptions.description })
      project = Object.assign(project, { name: descriptions.name })
      project = Object.assign(project, { customerName: descriptions.customerName })
    }
    return project
  },
  projectFilter: (state) => (filterString) => {
    if (filterString === null || filterString === '') {
      return state.projects
    }
    filterString = filterString.toLowerCase()
    return Object.values(state.projects).filter(project => {
      if (project.code.toString().includes(filterString)) {
        return true
      }
      for (let i = 0; i < project.descriptions.length; i++) {
        if (project.descriptions[i].name.toLowerCase().includes(filterString)) {
          return true
        }
      }
      return false
    })
  }
}
