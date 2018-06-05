import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import View from '../../src/views/Projects.vue'

describe('Profile.vue shallowMount', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  let store, cmp

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
