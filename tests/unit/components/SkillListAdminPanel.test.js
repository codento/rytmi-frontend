import { createWrapper } from './setup/setup'
import { SkillListAdminPanel, SkillListAdminPanelItem } from '@/components/Skills'

const mockSkillCategories = {
  1: {
    id: 1,
    title: { en: 'Old stuff', fi: 'Vanhoi jutui' },
    skillGroupId: 3
  },
  3: {
    id: 3,
    title: { en: 'New stuff', fi: 'Uusei jutui' },
    skillGroupId: 2
  },
  4: {
    id: 4,
    title: { en: 'Same stuff', fi: 'Samoi jutui' },
    skillGroupId: 3
  }
}

const mockSkillGroups = {
  2: {
    id: 2,
    title: { en: 'New group', fi: 'Uusi ryhmä' }
  },
  3: {
    id: 3,
    title: { en: 'Old group', fi: 'Vanha ryhmä' }
  },
  4: {
    id: 4,
    title: { en: 'Unused', fi: 'Käyttämätön' }
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
    // sorted alphabetically, new item should be first (sorted by fi)
    const expectedCategories = [
      { id: null, skillGroupId: null },

      {
        id: 4,
        title: { en: 'Same stuff', fi: 'Samoi jutui' },
        skillGroupId: 3
      },
      {
        id: 3,
        title: { en: 'New stuff', fi: 'Uusei jutui' },
        skillGroupId: 2
      },
      {
        id: 1,
        title: { en: 'Old stuff', fi: 'Vanhoi jutui' },
        skillGroupId: 3
      }
    ]
    const wrapper = createWrapper(SkillListAdminPanel, defaultStoreConfig, defaultMountingOptions)
    expect(wrapper.vm.sortedSkillCategories).toEqual(expectedCategories)
  })

  it('Should sort groups and add empty item to array', () => {
    // sorted alphabetically, new item should be first (sorted by fi)
    const expectedGroups = [
      { id: null, skillGroupId: null },
      {
        id: 4,
        title: { en: 'Unused', fi: 'Käyttämätön' }
      },
      {
        id: 2,
        title: { en: 'New group', fi: 'Uusi ryhmä' }
      },
      {
        id: 3,
        title: { en: 'Old group', fi: 'Vanha ryhmä' }
      }
    ]
    const wrapper = createWrapper(SkillListAdminPanel, defaultStoreConfig, defaultMountingOptions)
    expect(wrapper.vm.sortedSkillGroups).toEqual(expectedGroups)
  })
})
