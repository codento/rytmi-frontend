import { merge, cloneDeep } from 'lodash'
import flushPromises from 'flush-promises'
import { CvInfoEditEducation } from '@/components/EditProfile'

import { createWrapper } from './setup/setup'
import { mockProfile } from './setup/mockData'

const education = [
  { fi: { school: 'Yliopisto', degree: 'Joku tutkinto', major: null, minor: null },
    en: { school: 'University', degree: 'Some degree', major: 'My major', minor: 'My minor' },
    startYear: 2011,
    endYear: 2015
  },
  { fi: { school: 'Yliopisto2', degree: null, major: null, minor: null },
    en: { school: 'University2', degree: null, major: null, minor: null },
    startYear: 2015,
    endYear: 2016
  }
]
const profile = cloneDeep(mockProfile)
profile.education = education

const defaultStoreConfig = {
  actions: {
    updateProfile: jest.fn(() => [])
  }
}

const defaultMountingOptions = {
  propsData: {
    profile: profile
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

describe('CvInfoEditEducation.vue', () => {
  it('should show table with two data rows', () => {
    const wrapper = createWrapper(CvInfoEditEducation, defaultStoreConfig, defaultMountingOptions)
    const educationTable = wrapper.find('#education-table')
    // Header row plus two education items
    expect(educationTable.findAll('tr').length).toEqual(3)
  })

  it('should delete row when remove is clicked', async () => {
    expect.assertions(2)
    window.confirm = () => true

    const editedProfile = cloneDeep(mockProfile)
    editedProfile.education = [education[1]]

    const actions = {
      updateProfile: jest.fn((mapActionsStuff, profile, undef) => Promise.resolve(profile))
    }
    const overrideStoreConfig = merge({}, defaultStoreConfig, { actions })
    const wrapper = createWrapper(CvInfoEditEducation, overrideStoreConfig, defaultMountingOptions)
    wrapper.find('#remove-education-item-btn-0').trigger('click')
    await flushPromises()
    expect(actions.updateProfile).toHaveBeenCalledWith(
      expect.anything(), editedProfile, undefined)
    const educationTable = wrapper.find('#education-table')
    // Header row plus one education item
    expect(educationTable.findAll('tr').length).toEqual(2)
  })
})
