import Vuex from 'vuex'
import { shallow, createLocalVue } from 'vue-test-utils'
import View from '../../src/views/Project.vue'

describe('Project.vue shallow', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
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

    cmp = shallow(View, {
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
