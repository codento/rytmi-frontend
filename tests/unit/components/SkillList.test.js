import { merge } from 'lodash'
import flushPromises from 'flush-promises'
import { createWrapper } from './setup/setup'
import { SkillList } from '@/components/Skills/'
import { format } from 'date-fns'

// should be ordered alphabetically
const mockSkillList = [
  {
    id: 2,
    name: 'C',
    description: 'old robust shit',
    skillCategoryId: 2,
    skillCategoryName: 'Old stuff'
  },
  {
    id: 1,
    name: 'JavaScript',
    description: 'Jäsää',
    skillCategoryId: 1,
    skillCategoryName: 'New stuff'
  }
]

const mockSkillProfiles = [
  {
    description: 'How I know this stuff?',
    id: 1,
    knows: 3,
    profileId: 1,
    skillId: 1,
    visibleInCV: false,
    wantsTo: 2
  },
  {
    description: 'How I know this stuff?',
    id: 2,
    knows: 3,
    profileId: 2,
    skillId: 1,
    visibleInCV: false,
    wantsTo: 5
  }
]

const defaultStoreConfig = {
  actions: {
    deleteSkill: jest.fn()
  },
  getters: {
    skillProfiles: () => mockSkillProfiles,
    isAdmin: () => false
  }
}

const defaultMountingOptions = {
  propsData: {
    skillList: mockSkillList
  },
  mocks: {
    $toasted: {
      global: {
        rytmi_success: jest.fn(),
        rytmi_error: jest.fn()
      }
    }
  },
  $options: {
    filters: {
      dateFilter: function (value) {
        return value ? format(value, 'D.M.YYYY') : undefined
      }
    }
  }
}

describe('SkillList.vue', () => {
  it('Should render the list of skills', () => {
    const wrapper = createWrapper(SkillList, defaultStoreConfig, defaultMountingOptions)
    const tableRows = wrapper.find('#skill-list-table').findAll('tr')
    expect(tableRows).toHaveLength(3)
  })

  it('Should not render manage categories button when user is admin', () => {
    const wrapper = createWrapper(SkillList, defaultStoreConfig, defaultMountingOptions)
    expect(wrapper.find('#manage-categories-btn').exists()).toBeFalsy()
  })

  it('Should render manage categories button when user is admin', () => {
    const getters = {
      isAdmin: () => true
    }
    const mergedConfig = merge({}, defaultStoreConfig, { getters })
    const wrapper = createWrapper(SkillList, mergedConfig, defaultMountingOptions)
    expect(wrapper.find('#manage-categories-btn').isVisible()).toBeTruthy()
  })

  it('Should call the delete action if remove skill button is clicked', async () => {
    window.confirm = () => true
    const actions = {
      deleteSkill: jest.fn(() => Promise.resolve())
    }
    const mergedConfig = merge({}, defaultStoreConfig, { actions })
    const wrapper = createWrapper(SkillList, mergedConfig, defaultMountingOptions)
    wrapper.find('#remove-skill-item-btn-0').trigger('click')
    await flushPromises()
    expect(actions.deleteSkill).toHaveBeenCalledWith(expect.anything(), mockSkillList[0].id, undefined)
  })
})
