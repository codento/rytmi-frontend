import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { merge } from 'lodash'

import View from '@/views/Projects.vue'

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
      employers: () => mockEmployers
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

describe('Project view shallow', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)
  const store = createStore()
  let cmp

  beforeEach(() => {
    cmp = shallowMount(View, {
      store,
      localVue
    })
  })
  it('Template is correct', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
