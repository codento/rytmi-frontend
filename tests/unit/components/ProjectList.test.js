import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { ProjectList } from '@/components/Project'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      projectFilter: () => jest.fn((args) => args)
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
  return shallowMount(ProjectList, mergedMountingOptions)
}

describe('ProjectList.vue', () => {
  it('Calls openProject when btable emits row-clicked', () => {
    const mocks = {
      $router: {
        push: jest.fn()
      }
    }
    const wrapper = createWrapper({ mocks })
    const table = wrapper.find({ name: 'BTable' })
    table.vm.$emit('row-clicked', { id: 1 })
    expect(table.emitted).toHaveLength(1)
    expect(mocks.$router.push).toHaveBeenCalled()
  })

  it('Template is correct', () => {
    const wrapper = createWrapper()
    expect(wrapper.element).toMatchSnapshot()
  })
})
