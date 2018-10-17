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
import BootstrapVue from 'bootstrap-vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import View from '../../../src/views/Profile.vue'
import lodash from 'lodash'
import Loading from '../../../src/components/lib/loading'
import { skill } from './../../../src/store/schema';


/* eslint-enable */

describe('Profile.vue shallowMount', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)
  localVue.component('loading', Loading)

  let store, getters, cmp
  let $lodash = lodash

  const $route = {
    path: '/id',
    params: { id: 5 }
  }
  beforeEach(() => {
    getters = {
      profileId: () => (arg) => arg,
      profileById: () => (arg) => {
        return {
          id: arg,
          userId: 1,
          firstName: 'foo',
          lastName: 'bar',
          photoPath: '',
          title: 'software developer',
          accounts: [
            {
              address: 'twitter.com/foo'
            },
            {
              address: 'github.com/bar'
            }
          ],
          email: 'foo.bar@foo.com',
          phone: '1354',
          description: 'fdas'
        }
      },
      skillById: () => (skillId) => {
        return {
          id: skillId,
          name: 'Python',
          description: 'Python desc'
        }
      },
      skillsByProfileId: () => (profileId) => {
        return [
          {
            id: 1,
            name: 'Python',
            description: 'Python desc'
          }
        ]
      },
      profiles: () => (arg) => arg,
      skillsById: () => (arg) => arg,
      profileProjectsByProfileId: () => (profileId) => {
        return [
          {
            id: 1,
            profile: profileId,
            projectId: 1,
            startDate: '2018-01-01',
            endDate: '2018-02-01'
          }
        ]
      },
      projectById: () => (projectId) => {
        return {
          id: projectId,
          name: 'Project Foo',
          description: 'Foo Bar'
        }
      }
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
