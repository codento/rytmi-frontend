import { shallowMount, createLocalVue } from '@vue/test-utils'
import merge from 'lodash.merge'
import LandingPage from '../../../src/views/LandingPage'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('LandingPage.vue', () => {
  it('Landing page shows unauthenticated view when user is not signed in', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Please Sign in')
  })

  it('Landing page shows authenticated view when user is signed in', () => {
    const store = createStore({
      getters: {
        isAuthenticated: jest.fn(() => true)
      }
    })
    const wrapper = createWrapper({ store })
    expect(wrapper.text()).toContain('Ready to Rock ’n’ Roll')
  })
})

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      isAuthenticated: jest.fn(() => false)
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
};
