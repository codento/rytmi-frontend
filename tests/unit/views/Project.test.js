import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Project from '@/views/Project.vue'
import { ProjectProfileForm } from '@/components/Project'
import Loading from '@/components/helpers/LoadingSpinner'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.component('loading', Loading)

const projectMock = (projectId) => ({
  id: projectId,
  name: 'Project Foo',
  code: 50,
  description: 'Foo Bar',
  startDate: '2018-01-01',
  endDate: '2018-05-01'
})

const profileProjectMock = (projectId) => ([
  {
    id: 1,
    profile: 1,
    projectId: projectId,
    startDate: '2018-01-01',
    endDate: '2018-02-01'
  }
])

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      projectById: () => (projectId) => projectMock(projectId),
      profileProjectsByProjectId: () => (projectId) => profileProjectMock(projectId)
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
};

describe('Project.vue', () => {
  it('shows loading icon when project is being fetched', () => {
    const store = createStore({
      getters: {
        projectById: () => (projectId) => null
      }
    })
    const wrapper = createWrapper({ store })
    const spinner = wrapper.find(Loading)
    expect(spinner).not.toBe(null)
  })

  it('shows project information correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('h1').text()).toContain('Project Foo')
    const bElements = wrapper.findAll('b')
    const projectCode = bElements.at(0)
    const startDate = bElements.at(1).find({ name: 'DateFormatter' })
    const endDate = bElements.at(2).find({ name: 'DateFormatter' })
    const numOfMembers = bElements.at(3)
    expect(projectCode.text()).toContain(projectMock().code)
    expect(startDate.attributes('date')).toBe(projectMock().startDate)
    expect(endDate.attributes('date')).toBe(projectMock().endDate)
    expect(numOfMembers.text()).toBe(profileProjectMock().length.toString())
    expect(wrapper.find('p').text()).toContain(projectMock().description)
  })

  it('does not show members field if there are no members', () => {
    const store = createStore({
      getters: {
        profileProjectsByProjectId: () => (id) => null
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.find('span[class="detail members').text()).toBe('Consultants')
  })

  it('opens the add consultant form when clicked', () => {
    const wrapper = createWrapper()
    expect(wrapper.find(ProjectProfileForm).exists()).toBe(false)
    wrapper.find('h3').trigger('click')
    expect(wrapper.find(ProjectProfileForm).exists()).toBe(true)
  })

  it('Template is correct', () => {
    const wrapper = createWrapper()
    expect(wrapper.element).toMatchSnapshot()
  })
})
