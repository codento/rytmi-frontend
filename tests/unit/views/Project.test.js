import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Project from '@/views/Project.vue'
import Loading from '@/components/helpers/LoadingSpinner'
import { format } from 'date-fns'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.component('loading', Loading)
localVue.filter('dateFilter', value => {
  return value ? format(value, 'D.M.YYYY') : undefined
})

const projectMock = (projectId) => ({
  id: projectId,
  name: { en: 'Project Foo', fi: 'Projekti Foo' },
  description: { en: 'Foo Bar', fi: 'Foo Bar' },
  customerName: { en: 'Customer', fi: 'Asiakas' },
  code: 50,
  startDate: new Date('2018-01-01'),
  endDate: new Date('2018-05-01')
})

const profileProjectMock = (projectId) => ([
  {
    id: 1,
    profile: 1,
    projectId: projectId,
    startDate: '2018-01-01',
    endDate: '2018-02-01',
    role: { en: 'Developer', fi: 'Devaaja' }
  }
])

const mockEmployers = {
  1: {
    createdAt: '2019-05-21T13:21:48.222Z',
    id: 1,
    name: 'Codento Oy',
    updatedAt: '2019-05-21T13:21:48.222Z'
  },
  2: {
    createdAt: '2019-05-21T13:21:56.034Z',
    id: 2,
    name: 'Macejkovic Inc',
    updatedAt: '2019-05-21T13:21:56.034Z'
  }
}

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      projectById: () => (projectId) => projectMock(projectId),
      profileProjectsByProjectId: () => (projectId) => profileProjectMock(projectId),
      employers: () => mockEmployers,
      currentLanguage: () => 'fi'
    },
    state: {
      siteSettings: { currentLanguage: 'fi' }
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    mocks: {
      $route: {
        path: '/id',
        params: { id: 5 }
      }
    },
    localVue,
    store: createStore()
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(Project, mergedMountingOptions)
}

describe('Project.vue', () => {
  it('shows loading icon when project is being fetched', () => {
    const store = createStore({
      getters: {
        projectById: () => (projectId) => null,
        employers: () => mockEmployers
      }
    })
    const wrapper = createWrapper({ store })
    const spinner = wrapper.find(Loading)
    expect(spinner).not.toBe(null)
  })

  it('shows project information correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('h1').text()).toEqual(projectMock().name.fi)
    const bElements = wrapper.findAll('b')
    const projectCode = bElements.at(0)
    const startDate = wrapper.find('.project-start-date')
    const endDate = wrapper.find('.project-end-date')
    const numOfMembers = bElements.at(3)
    expect(projectCode.text()).toEqual(projectMock().code.toString())
    expect(startDate.text()).toBe(format(projectMock().startDate, 'D.M.YYYY'))
    expect(endDate.text()).toBe(format(projectMock().endDate, 'D.M.YYYY'))
    expect(numOfMembers.text()).toBe(profileProjectMock().length.toString())
    expect(wrapper.find('p').text()).toContain(projectMock().description.fi)
  })

  it('does not show members field if there are no members', () => {
    const store = createStore({
      getters: {
        profileProjectsByProjectId: () => (id) => null,
        employers: () => mockEmployers
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.find('span[class="detail members').text()).toBe('Consultants')
  })

  it('Template is correct', () => {
    const store = createStore({
      getters: {
        profileProjectsByProjectId: () => (id) => null,
        employers: () => mockEmployers
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.element).toMatchSnapshot()
  })
})
