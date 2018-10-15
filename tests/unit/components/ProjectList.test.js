import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'

import { shallowMount, createLocalVue } from '@vue/test-utils'
import { ProjectList } from '../../../src/components/Project'

describe('ProjectList.test.js', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  let store, cmp

  const getters = {
    projects: () => (arg) => arg,
    projectFilter: () => (arg) => arg
  }

  store = new Vuex.Store({ getters })
  beforeEach(() => {
    cmp = shallowMount(
      ProjectList, {
        store,
        localVue
      }
    )
  })

  it('Template is correct', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
