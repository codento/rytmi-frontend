import projectModule from '@/store/modules/projects'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import LANGUAGE_ENUM from '@/utils/constants'

jest.mock('@/utils/api/api')

const localVue = createLocalVue()
localVue.use(Vuex)

const initialProjectState = {
  language: {
    currentLanguage: LANGUAGE_ENUM.DEFAULT_LANGUAGE
  },
  projects: {
    one: {
      descriptions: [
        { name: 'one', description: 'test', language: 'en' },
        { name: 'yksi', description: 'testi', language: 'fi' }
      ],
      code: 1
    },
    two: {
      descriptions: [
        { name: 'two', language: 'en' },
        { name: 'kaksi', language: 'fi' }
      ],
      code: 2
    },
    twentyOne: {
      descriptions: [
        { name: 'twentyone', language: 'en' },
        { name: 'kakskytyks', language: 'fi' }
      ],
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

  it('should return the correct project with given id', () => {
    const defaultDescriptions = initialProjectState.projects.one.descriptions
      .find(description => description.language === LANGUAGE_ENUM.DEFAULT_LANGUAGE)
    expect(store.getters.projectById('one')).toEqual(
      { code: 1,
        name: defaultDescriptions.name,
        description: defaultDescriptions.description,
        descriptions: initialProjectState.projects.one.descriptions
      }
    )
  })

  it('should return the unfiltered list', () => {
    expect(store.getters.projectFilter('')).toBe(initialProjectState.projects)
  })

  it('should return the filtered projects', () => {
    const projects = initialProjectState.projects
    expect(store.getters.projectFilter('one')).toEqual([projects.one, projects.twentyOne])
  })
})
