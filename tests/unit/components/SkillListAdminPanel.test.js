import { createWrapper } from './setup/setup'
import { SkillListAdminPanel, SkillListAdminPanelItem } from '@/components/Skills'

const mockSkillCategories = {
  1: {
    id: 1,
    title: 'Old stuff',
    skillGroupId: 3
  },
  3: {
    id: 3,
    title: 'New stuff',
    skillGroupId: 2
  },
  4: {
    id: 4,
    title: 'Same stuff',
    skillGroupId: 3
  }
}

const mockSkillGroups = {
  2: {
    id: 2,
    title: 'New group'
  },
  3: {
    id: 3,
    title: 'Old group'
  },
  4: {
    id: 4,
    title: 'Unused'
  }
}

const defaultStoreConfig = {
  getters: {
    skillCategories: () => mockSkillCategories,
    skillGroups: () => mockSkillGroups
  }
}

const defaultMountingOptions = {
  propsData: {
    close: jest.fn()
  }
}

describe('SkillListAdminPanel.vue', () => {
  it('Should render one child component for categories and groups each', () => {
    const wrapper = createWrapper(SkillListAdminPanel, defaultStoreConfig, defaultMountingOptions)
    const childComponents = wrapper.findAll(SkillListAdminPanelItem)
    expect(childComponents).toHaveLength(2)
  })

  it('Should sort categories and add empty item to array', () => {
    // sorted alphabetically, new item should be first
    const expectedCategories = [
      { id: null, skillGroupId: null },
      {
        id: 3,
        title: 'New stuff',
        skillGroupId: 2
      },
      {
        id: 1,
        title: 'Old stuff',
        skillGroupId: 3
      },
      {
        id: 4,
        title: 'Same stuff',
        skillGroupId: 3
      }
    ]
    const wrapper = createWrapper(SkillListAdminPanel, defaultStoreConfig, defaultMountingOptions)
    expect(wrapper.vm.sortedSkillCategories).toEqual(expectedCategories)
  })

  it('Should sort groups and add empty item to array', () => {
    // sorted alphabetically, new item should be first
    const expectedGroups = [
      { id: null, skillGroupId: null },
      {
        id: 2,
        title: 'New group'
      },
      {
        id: 3,
        title: 'Old group'
      },
      {
        id: 4,
        title: 'Unused'
      }
    ]
    const wrapper = createWrapper(SkillListAdminPanel, defaultStoreConfig, defaultMountingOptions)
    expect(wrapper.vm.sortedSkillGroups).toEqual(expectedGroups)
  })
})
