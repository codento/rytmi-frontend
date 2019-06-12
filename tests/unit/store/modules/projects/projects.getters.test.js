import projectModule from '@/store/modules/projects'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

jest.mock('@/utils/api/api')

const localVue = createLocalVue()
localVue.use(Vuex)

const initialProjectState = {
  siteSettings: {
    currentLanguage: 'fi'
  },
  projects: {
    1: {
      id: 1,
      code: 100,
      name: { en: 'one', fi: 'yksi' },
      description: { en: 'descOne', fi: 'kuvausYksi' },
      customerName: { en: 'customer1', fi: 'asiakas1' }
    },
    2: {
      id: 2,
      code: 200,
      name: { en: 'two', fi: 'kaksi' },
      description: { en: 'descTwo', fi: 'kuvausKaksi' },
      customerName: { en: 'customer1', fi: 'asiakas1' }
    },
    3: {
      id: 3,
      code: 300,
      name: { en: 'almostOne', fi: 'kuinYksi' },
      description: { en: 'descAlmostOne', fi: 'kuvausKuinYksi' },
      customerName: { en: 'customer1', fi: 'asiakas1' }
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
    expect(store.getters.projectById(1)).toEqual(
      { id: 1,
        code: 100,
        name: { en: 'one', fi: 'yksi' },
        description: { en: 'descOne', fi: 'kuvausYksi' },
        customerName: { en: 'customer1', fi: 'asiakas1' }
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
