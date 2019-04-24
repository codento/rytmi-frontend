import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import LandingPage from '@/views/LandingPage'
import Dashboard from '@/components/Dashboard'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      isAuthenticated: jest.fn(() => false),
      employeeRoles: () => [{ id: 1, title: 'administrative' }]
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    localVue,
    store: createStore()
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(LandingPage, mergedMountingOptions)
}

describe('LandingPage.vue', () => {
  it('Landing page shows unauthenticated view when user is not signed in', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Please Sign in')
  })

  it('Landing page should not mount dashboard view if employee profiles are not yet loaded', () => {
    const store = createStore({
      getters: {
        isAuthenticated: jest.fn(() => true),
        employeeRoles: () => []
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.find(Dashboard).exists()).toBeFalsy()
  })

  it('Landing page shows dashboard view when user is signed in', () => {
    const store = createStore({
      getters: {
        isAuthenticated: jest.fn(() => true)
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.find(Dashboard).isVisible()).toBeTruthy()
  })
})
