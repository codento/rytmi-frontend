import { merge, cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'
import { CvInfoEditIntroduction } from '@/components/EditProfile'

import { createWrapper } from './setup/setup'
import { mockProfile } from './setup/mockData'

const defaultStoreConfig = {
  actions: {
    updateProfile: jest.fn(() => [])
  }
}

const defaultMountingOptions = {
  propsData: {
    profile: mockProfile
  },
  mocks: {
    $toasted: {
      global: {
        rytmi_success: jest.fn(),
        rytmi_error: jest.fn()
      }
    },
    $router: {
      push: jest.fn()
    }
  }
}

describe('CvInfoEditIntroduction.vue', () => {
  it('should should show profile introduction correctly', () => {
    const wrapper = createWrapper(CvInfoEditIntroduction, defaultStoreConfig, defaultMountingOptions)
    expect(wrapper.vm.editedIntroductions).toEqual(mockProfile.introduction)
    const inputWrappers = wrapper.findAll('textarea')
    expect(inputWrappers.at(0).vm.value).toBe(mockProfile.introduction.fi)
    expect(inputWrappers.at(1).vm.value).toBe(mockProfile.introduction.en)
  })

  it('should submit entered details when submit is clicked', async () => {
    expect.assertions(1)
    const editedProfile = cloneDeep(mockProfile)
    editedProfile.introduction.en = 'New introduction'

    const actions = {
      updateProfile: jest.fn((mapActionsStuff, profile, undef) => Promise.resolve(profile))
    }
    const overrideStoreConfig = merge({}, defaultStoreConfig, { actions })
    const wrapper = createWrapper(CvInfoEditIntroduction, overrideStoreConfig, defaultMountingOptions)
    wrapper.find('#input-introduction-en').setValue('New introduction')
    wrapper.find('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(actions.updateProfile).toHaveBeenCalledWith(
      expect.anything(), editedProfile, undefined)
  })
})
