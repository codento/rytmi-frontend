import { merge, cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'
import { EditBasicProfileInfo } from '@/components/Profile'

import { createWrapper } from './setup/setup'

const mockEmployeeRoles = [
  { id: 1, title: 'somethinger' },
  { id: 2, title: 'dunno lol' }
]

const defaultStoreConfig = {
  actions: {
    updateProfile: jest.fn(() => [])
  },
  getters: {
    employeeRoles: jest.fn(() => mockEmployeeRoles)
  }
}

const mockProfile = {
  id: 2,
  firstName: 'Foo',
  lastName: 'Bar',
  role: 'Employee role',
  birthYear: 1984,
  phone: 1234,
  introduction: {
    fi: 'kuvaus1',
    en: 'desc1'
  },
  education: [
    { fi: { school: 'Yliopisto', degree: 'Joku tutkinto', major: null, minor: null },
      en: { school: 'University', degree: 'Some degree', major: 'My major', minor: 'My minor' },
      startYear: 2011,
      endYear: 2015
    }
  ],
  email: 'foo.bar@barfoo.com',
  employeeRoles: [1],
  links: ['http://christy.net', 'http://holly.biz', 'http://www.linkedin.com/username']
}

const defaultMountingOptions = {
  propsData: {
    profile: mockProfile
  },
  mocks: {
    $toasted: {
      global: {
        rytmi_success: jest.fn()
      }
    }
  }
}

describe('EditBasicProfileInfo.vue', () => {
  it('should should show profile details correctly', () => {
    const wrapper = createWrapper(EditBasicProfileInfo, defaultStoreConfig, defaultMountingOptions)
    expect(wrapper.vm.editedProfile).toEqual(mockProfile)
    const inputWrappers = wrapper.findAll('input')
    expect(inputWrappers.at(0).vm.value).toBe(mockProfile.firstName)
    expect(inputWrappers.at(1).vm.value).toBe(mockProfile.lastName)
    expect(inputWrappers.at(3).vm.value).toBe(mockProfile.birthYear)
    expect(inputWrappers.at(4).vm.value).toBe(mockProfile.email)
    expect(inputWrappers.at(5).vm.value).toBe(mockProfile.phone)
    const textAreaWrappers = wrapper.findAll('textarea')
    expect(textAreaWrappers.at(0).vm.value).toBe(mockProfile.introduction.fi)
    expect(textAreaWrappers.at(1).vm.value).toBe(mockProfile.introduction.en)
  })

  it('should submit entered details when submit is clicked', async () => {
    expect.assertions(1)
    const editedProfile = cloneDeep(mockProfile)
    editedProfile.firstName = 'Bar'

    const mocks = {
      $router: {
        push: jest.fn()
      }
    }
    const actions = {
      updateProfile: jest.fn((mapActionsStuff, profile, undef) => Promise.resolve(profile))
    }
    const overrideStoreConfig = merge({}, defaultStoreConfig, { actions })
    const overrideMountingOptions = merge({}, defaultMountingOptions, { mocks })
    const wrapper = createWrapper(EditBasicProfileInfo, overrideStoreConfig, overrideMountingOptions)
    wrapper.find('#first-name-input').setValue('Bar')
    wrapper.find('button[type="submit"]').trigger('submit')
    await flushPromises()
    expect(actions.updateProfile).toHaveBeenCalledWith(
      expect.anything(), editedProfile, undefined)
  })

  it('returns correct employeeRoleList', () => {
    const wrapper = createWrapper(EditBasicProfileInfo, defaultStoreConfig, defaultMountingOptions)
    wrapper.setData({ selectedEmployeeRoles: [] })
    expect(wrapper.vm.employeeRoleList).toEqual([{ 'id': 1, 'label': 'somethinger' }, { 'id': 2, 'label': 'dunno lol' }])
  })
})
