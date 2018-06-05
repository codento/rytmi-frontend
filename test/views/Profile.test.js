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
/* eslint-disable */
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import View from '../../src/views/Profile.vue'
import lodash from 'lodash'
/* eslint-enable */

describe('Profile.vue shallowMount', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  let store, getters, cmp
  let $lodash = lodash

  const $route = {
    path: '/id',
    params: {id: 5}
  }
  beforeEach(() => {
    getters = {
      profileId: () => (arg) => arg,
      profileById: () => (arg) => arg,
      profiles: () => (arg) => arg,
      skillsById: () => (arg) => arg,
      skillsByProfileId: () => (arg) => arg,
      profileProjectsByProfileId: () => (arg) => arg
    }
    store = new Vuex.Store({ getters })

    cmp = shallowMount(View, {
      store,
      localVue,
      mocks: {
        $lodash,
        $route
      }
    })
  })
  it('Template is correct', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
