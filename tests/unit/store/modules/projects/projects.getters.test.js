import projectModule from '@/store/modules/projects'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { LANGUAGE_ENUM } from '@/utils/constants'

jest.mock('@/utils/api/api')

const localVue = createLocalVue()
localVue.use(Vuex)

const initialProjectState = {
  siteSettings: {
    currentLanguage: LANGUAGE_ENUM.DEFAULT_LANGUAGE
  },
  projects: {
    1: {
      id: 1,
      code: 100,
      descriptions: [
        { name: 'one', description: 'descOne', customerName: 'customer1', language: 'en' },
        { name: 'yksi', description: 'descYksi', customerName: 'asiakas1', language: 'fi' }
      ]
    },
    2: {
      id: 2,
      code: 200,
      descriptions: [
        { name: 'two', description: 'descTwo', language: 'en' },
        { name: 'kaksi', description: 'descKaksi', language: 'fi' }
      ]
    },
    3: {
      id: 3,
      code: 300,
      descriptions: [
        { name: 'almostOne', description: 'descAlmostOne', customerName: 'customer1', language: 'en' },
        { name: 'kuinYksi', description: 'descKuinYksi', customerName: 'asiakas1', language: 'fi' }
      ]
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
    const defaultDescriptions = initialProjectState.projects[1].descriptions
      .find(description => description.language === LANGUAGE_ENUM.DEFAULT_LANGUAGE)
    expect(store.getters.projectById(1)).toEqual(
      { code: 100,
        id: 1,
        name: defaultDescriptions.name,
        customerName: defaultDescriptions.customerName,
        description: defaultDescriptions.description,
        descriptions: initialProjectState.projects[1].descriptions
      }
    )
  })

  it('should return the unfiltered list', () => {
    expect(store.getters.projectFilter('')).toBe(initialProjectState.projects)
  })

  it('should return the filtered projects', () => {
    const projects = initialProjectState.projects
    expect(store.getters.projectFilter('One')).toEqual(
      {
        1: projects[1],
        3: projects[3]
      }
    )
  })
})
