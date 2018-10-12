import {
  shallow,
  createLocalVue
} from '@vue/test-utils'
import Vuex from 'vuex'
import { UserProfileCard } from '../../../src/components/Profile'

describe('UserProfileCard.test.js', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  let store, getters

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
  })
  it('Template is correct', () => {
    let wrapper = shallow(UserProfileCard, {
      store,
      localVue,
      propsData: {
        profile: {
          name: 'test',
          email: 'mail',
          phone: '1231123',
          mail: 'mail@mail.comi',
          accounts: null,
          photoPath: 'shouldNotWork'
        }
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
