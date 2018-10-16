import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'

import View from '../../../src/views/Projects.vue'

describe('Profile.vue shallow', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)
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
