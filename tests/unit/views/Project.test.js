import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import View from '../../../src/views/Project.vue'

describe('Project.vue shallowMount', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)
  let store, getters, cmp

  const $route = {
    path: '/id',
    params: {id: 5}
  }
  beforeEach(() => {
    getters = {
      projectById: () => (arg) => arg,
      profileProjectsByProjectId: () => (arg) => arg
    }
    store = new Vuex.Store({ getters })

    cmp = shallowMount(View, {
      store,
      localVue,
      mocks: {
        $route
      }
    })
  })
  it('Template is correct', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
