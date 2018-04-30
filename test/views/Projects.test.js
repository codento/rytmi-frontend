import Vuex from 'vuex'
import { shallow, createLocalVue } from 'vue-test-utils'
import View from '../../src/views/Projects.vue'

describe('Profile.vue shallow', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  let store, cmp

  beforeEach(() => {
    cmp = shallow(View, {
      store,
      localVue
    })
  })
  it('Template is correct', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
