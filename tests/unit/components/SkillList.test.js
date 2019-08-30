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
    description: 'old robust stuff',
    skillCategoryId: 2,
    skillCategoryName: { en: 'Old stuff', fi: 'Vanhoi jutui' },
    skillGroupName: { en: 'Old stuff', fi: 'Vanhoi jutui' }
  },
  {
    id: 1,
    name: 'JavaScript',
    description: 'Jäsää',
    skillCategoryId: 1,
    skillCategoryName: { en: 'New stuff', fi: 'Uusei jutui' },
    skillGroupName: { en: 'New stuff', fi: 'Uusei jutui' }
  }
]

const mockSkillProfiles = [
  {
    description: 'How I know this stuff?',
    id: 1,
    knows: 3,
    profileId: 1,
    skillId: 1,
    wantsTo: 2
  },
  {
    description: 'How I know this stuff?',
    id: 2,
    knows: 3,
    profileId: 2,
    skillId: 1,
    wantsTo: 5
  }
]

const defaultStoreConfig = {
  actions: {
    deleteSkill: jest.fn()
  },
  getters: {
    skillProfiles: () => mockSkillProfiles,
    skillFilter: () => false,
    currentLanguage: () => 'fi'
  }
}

const defaultMountingOptions = {
  propsData: {
    skillList: mockSkillList,
    filterValues: []
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
    expect(wrapper.vm.tableItems).toHaveLength(2)
  })

  it('Should filter skills by name or category', () => {
    const wrapper = createWrapper(SkillList, defaultStoreConfig, defaultMountingOptions)
    // check sorting with lower case value
    wrapper.setData({ filterValues: { name: 'java' } })
    expect(wrapper.vm.tableItems).toHaveLength(1)
    expect(wrapper.vm.tableItems[0].name).toEqual('JavaScript')

    // check sorting with upper case value
    wrapper.setData({ filterValues: { name: 'Java' } })
    expect(wrapper.vm.tableItems).toHaveLength(1)

    // check dropdown item sorting
    wrapper.setData({ filterValues: { skillCategoryName: ['Uusei jutui'] } })
    expect(wrapper.vm.tableItems).toHaveLength(1)
  })

  it('Should call the delete action if remove skill button is clicked', async () => {
    window.confirm = () => true
    const actions = {
      deleteSkill: jest.fn(() => Promise.resolve())
    }
    const mergedConfig = merge({}, defaultStoreConfig, { actions })
    const wrapper = createWrapper(SkillList, mergedConfig, defaultMountingOptions)
    wrapper.find('#remove-skill-item-0').trigger('click')
    await flushPromises()
    expect(actions.deleteSkill).toHaveBeenCalledWith(expect.anything(), mockSkillList[0].id, undefined)
  })
})
