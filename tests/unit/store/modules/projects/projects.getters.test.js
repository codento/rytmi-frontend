import projectModule from '../../../../../src/store/modules/projects'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

jest.mock('../../../../../src/utils/api')

const localVue = createLocalVue()
localVue.use(Vuex)

const initialProjectState = {
  projects: {
    one: {
      name: 'one',
      code: 1
    },
    two: {
      name: 'two',
      code: 2
    },
    twentyOne: {
      name: 'twentyone',
      code: 21
    }

  },
  projectList: [],
  profileProjectList: {}
}

projectModule.state = initialProjectState

const store = new Vuex.Store(projectModule)

describe('Projects.getters', () => {
  it('should return the projects ', () => {
    expect(store.getters.projects).toBe(initialProjectState.projects)
  })

  it('should return the project with given id', () => {
    expect(store.getters.projectById('one')).toBe(initialProjectState.projects.one)
  })

  it('should return the unfiltered list', () => {
    expect(store.getters.projectFilter('')).toBe(initialProjectState.projects)
  })

  it('should return the filtered projects', () => {
    const projects = initialProjectState.projects
    expect(store.getters.projectFilter('one')).toEqual([projects.one, projects.twentyOne])
  })
})
