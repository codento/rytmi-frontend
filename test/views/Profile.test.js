jest.mock('lodash', () => ({
  orderBy: jest.fn(() => {
    return [{
      name: 'Vue.js',
      knows: 0,
      wantsTo: 2,
      id: 7
    }]
  })
}))
import Vuex from 'vuex'
import { shallow, createLocalVue } from 'vue-test-utils'
import View from '../../src/views/Profile.vue'
import lodash from 'lodash'

describe('Profile.test.js', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  let store
  let getters
  let cmp
  let $lodash = lodash
  beforeEach(() => {


    getters = {
      profileById: () => (arg) => arg,
      profiles: () => (arg) => arg,
      skillsById: () => (arg) => arg
    }
    store = new Vuex.Store({ getters })

    cmp = shallow(View, {
      store,
      localVue,
      mocks: {
        $lodash
      }
    })
  })
  it('Template is correct', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
