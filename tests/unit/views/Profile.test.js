jest.mock('lodash', () => ({
  orderBy: jest.fn(() => {
    return [
      {
        name: 'Vue.js',
        knows: 0,
        wantsTo: 2,
        id: 7
      }
    ]
  })
}))

/* eslint-disable */
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import View from '@/views/Profile.vue'
import lodash from 'lodash'
import Loading from '@/components/helpers/LoadingSpinner'
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
          introduction: { fi: 'intro in Finnish', en: 'intro in English' }
        }
      },
      skillById: () => (skillId) => {
        return {
          id: skillId,
          name: 'Python',
          description: 'Python desc'
        }
      },
      profileSkillsByProfileId: () => (profileId) => {
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
          name: { en: 'Project Foo (en)', fi: 'Projekti Foo' },
          customerName: { en: 'Customer', fi: 'Asiakas' },
          description: { en: 'Foo Bar (en)', fi: 'Foo Bar' }
        }
      },
      profileEmployersByProfileId: () => (profileId) => {
        return [
          {
            profileId,
            employerId: 1
          }
        ]
      },
      employers: () => () => {
        return [
          {
            name: 'Codento Oy',
            id: 1
          }
        ]
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
