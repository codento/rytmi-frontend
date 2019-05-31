import { merge } from 'lodash'
import flushPromises from 'flush-promises'
import { createWrapper } from './setup/setup'
import { SkillListAdminPanelItem } from '@/components/Skills'

const skillCategoriesAsProps = [
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
    skillCategories: () => mockSkillGroups,
    skillGroups: () => mockSkillGroups
  }
}

const defaultMountingOptions = {
  propsData: {
    isSkillCategory: true,
    listItems: skillCategoriesAsProps,
    label: 'Test label',
    updateAction: jest.fn(),
    createAction: jest.fn()
  },
  mocks: {
    $toasted: {
      global: {
        rytmi_success: jest.fn(),
        rytmi_error: jest.fn()
      }
    }
  }
}

describe('SkillListAdminPanelItem.vue', () => {
  it('Should render correct amount of items (first item hidden initially)', () => {
    const wrapper = createWrapper(SkillListAdminPanelItem, defaultStoreConfig, defaultMountingOptions)
    const itemsWrapper = wrapper.findAll('.list-group-item')
    expect(itemsWrapper).toHaveLength(3)
    const expectedTitles = [skillCategoriesAsProps[1].title, skillCategoriesAsProps[2].title, skillCategoriesAsProps[3].title]
    expect(itemsWrapper.filter((item, index) => item.html().includes(expectedTitles[index]))).toHaveLength(3)
  })
})

describe('Editing item in SkillListAdminPanelItem.vue', () => {
  let wrapper
  const idPrefix = 'test-label'
  const originalItem = { ...skillCategoriesAsProps[1] }
  const propsData = {
    updateAction: jest.fn(() => Promise.resolve())
  }
  beforeEach(() => {
    const mergedOptions = merge({}, defaultMountingOptions, { propsData })
    wrapper = createWrapper(SkillListAdminPanelItem, defaultStoreConfig, mergedOptions)
    // find first item and click to open edit form
    const itemsWrapper = wrapper.find('.list-group-item')
    itemsWrapper.trigger('click')
  })

  it('Should update form values with correct values', () => {
    expect(wrapper.vm.idPrefix).toEqual(idPrefix)
    expect(wrapper.vm.editedId).toEqual(originalItem.id)
    expect(wrapper.vm.editedName).toEqual(originalItem.title)
    expect(wrapper.vm.selectedSkillGroupId).toEqual(originalItem.skillGroupId)
  })

  it('Should call update action if save button is clicked', async () => {
    expect.assertions(3)
    const editedItem = {
      id: 3,
      title: 'New stuff2',
      skillGroupId: 2
    }
    // Form (exactly one) should be visible
    expect(wrapper.findAll(`#save-${idPrefix}-edits-btn`).length).toEqual(1)
    // Edit data
    wrapper.setData({ editedName: editedItem.title })
    wrapper.setData({ showFeedback: true })
    // Save edits
    wrapper.find(`#save-${idPrefix}-edits-btn`).trigger('click')
    await flushPromises()
    expect(propsData.updateAction).toHaveBeenCalledWith(editedItem)
    // Form should not be visible
    expect(wrapper.html().includes('input')).toBeFalsy()
  })

  it('Should reset values if cancel button is clicked', () => {
    const editedItem = {
      id: 3,
      title: 'New stuff2',
      skillGroupId: 2
    }
    // Edit data
    wrapper.setData({ editedName: editedItem.title })
    wrapper.setData({ showFeedback: true })
    // Save edits
    wrapper.find(`#cancel-${idPrefix}-edits-btn`).trigger('click')
    expect(wrapper.vm.editedId).toEqual(null)
    expect(wrapper.vm.editedName).toEqual('')
    expect(wrapper.vm.selectedSkillGroupId).toEqual(null)
    // Form should not be visible
    expect(wrapper.html().includes('input')).toBeFalsy()
  })
})

describe('Creating item in SkillListAdminPanelItem.vue', () => {
  let wrapper
  const idPrefix = 'test-label'
  const propsData = {
    createAction: jest.fn(() => Promise.resolve())
  }
  beforeEach(() => {
    const mergedOptions = merge({}, defaultMountingOptions, { propsData })
    wrapper = createWrapper(SkillListAdminPanelItem, defaultStoreConfig, mergedOptions)
    // find add new button and click it to open the editing form
    wrapper.find(`#add-new-${idPrefix}-btn`).trigger('click')
  })

  it('Should call create action if save button is clicked', async () => {
    expect.assertions(3)
    const expectedItem = {
      title: 'New stuff2',
      skillGroupId: 2
    }
    // Form (exactly one) should be visible
    expect(wrapper.findAll(`#save-${idPrefix}-edits-btn`).length).toEqual(1)
    // Edit data
    wrapper.setData({ editedName: expectedItem.title })
    wrapper.setData({ selectedSkillGroupId: expectedItem.skillGroupId })
    wrapper.setData({ showFeedback: true })
    // Save edits
    wrapper.find(`#save-${idPrefix}-edits-btn`).trigger('click')
    await flushPromises()
    expect(propsData.createAction).toHaveBeenCalledWith(expectedItem)
    // Form should not be visible
    expect(wrapper.html().includes('input')).toBeFalsy()
  })

  it('Should reset values if cancel button is clicked', () => {
    // Edit data
    wrapper.setData({ editedName: 'Something' })
    wrapper.setData({ showFeedback: true })
    // Save edits
    wrapper.find(`#cancel-${idPrefix}-edits-btn`).trigger('click')
    expect(wrapper.vm.editedId).toEqual(null)
    expect(wrapper.vm.editedName).toEqual('')
    expect(wrapper.vm.selectedSkillGroupId).toEqual(null)
    // Form should not be visible
    expect(wrapper.html().includes('input')).toBeFalsy()
  })
})
