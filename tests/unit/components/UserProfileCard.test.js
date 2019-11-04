import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils'
import Vuex from 'vuex'
import { UserProfileCard } from '@/components/Profile'

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
      profileSkillsByProfileId: () => (arg) => arg,
      profileProjectsByProfileId: () => (arg) => arg,
      employeeRoles: () => [{ 'id': 1, 'title': 'somethinger' }, { 'id': 2, 'title': 'dunno lol' }],
      employeeRoleList: (arg) => [1, 2]
    }
    store = new Vuex.Store({ getters })
  })
  it('Template is correct', () => {
    let wrapper = shallowMount(UserProfileCard, {
      store,
      localVue,
      propsData: {
        profile: {
          name: 'test',
          email: 'mail',
          phone: '1231123',
          mail: 'mail@mail.comi',
          photoPath: 'shouldNotWork',
          employeeRoles: [1]
        }
      },
      stubs: ['b-img']
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
