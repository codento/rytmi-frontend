import { merge } from 'lodash'
import flushPromises from 'flush-promises'
import { createWrapper } from './setup/setup'
import { SkillListEditSkill } from '@/components/Skills'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel'

const mockSkill = {
  id: 1,
  name: 'JavaScript',
  description: 'Jäsää',
  skillCategoryId: 1
}

const mockSkillCategories = {
  1: {
    id: 1,
    skillGroupId: 1,
    title: 'New stuff'
  },
  2: {
    id: 2,
    skillGroupId: 1,
    title: 'Old stuff'
  }
}

const defaultStoreConfig = {
  actions: {
    updateSkill: jest.fn(),
    addSkill: jest.fn()
  },
  getters: {
    skills: () => [],
    skillCategories: () => mockSkillCategories
  }
}

const defaultMountingOptions = {
  propsData: {
    skill: mockSkill,
    close: jest.fn()
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

describe('SkillListEditSkill.vue', () => {
  it('Should show form with skill props data', () => {
    const wrapper = createWrapper(SkillListEditSkill, defaultStoreConfig, defaultMountingOptions)
    expect(wrapper.find('input[type="text"]').element.value).toBe(mockSkill.name)
    expect(wrapper.vm.selectedSkillCategoryId).toBe(mockSkillCategories[1].id)
    expect(wrapper.find('textarea').element.value).toBe(mockSkill.description)
  })

  it('Should submit new skill if id is null', async () => {
    expect.assertions(3)
    const actions = {
      addSkill: jest.fn(() => Promise.resolve())
    }
    const propsData = {
      skill: { id: null }
    }
    const expected = {
      name: 'New skill',
      description: 'Some description',
      skillCategoryId: 1
    }
    const mergedConfig = merge({}, defaultStoreConfig, { actions })
    const mergedOptions = merge({}, defaultMountingOptions, { propsData })
    const wrapper = createWrapper(SkillListEditSkill, mergedConfig, mergedOptions)
    wrapper.find('input[type="text"]').setValue('New skill')
    wrapper.find('textarea').setValue('Some description')
    wrapper.setData({ selectedSkillCategoryId: 1 })
    expect(wrapper.find('button[type="submit"]').html().includes('disabled')).toBeFalsy()
    wrapper.find('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(actions.addSkill).toHaveBeenCalledWith(expect.anything(), expected, undefined)
    expect(defaultMountingOptions.propsData.close).toHaveBeenCalled()
  })

  it('Should submit the edited skill and call close', async () => {
    expect.assertions(2)
    const actions = {
      updateSkill: jest.fn(() => Promise.resolve())
    }
    const expected = {
      id: 1,
      name: 'TypeScript',
      description: 'TypeScript is betterer',
      skillCategoryId: 1
    }
    const mergedConfig = merge({}, defaultStoreConfig, { actions })
    const wrapper = createWrapper(SkillListEditSkill, mergedConfig, defaultMountingOptions)
    wrapper.find('input[type="text"]').setValue('TypeScript')
    wrapper.find('textarea').setValue('TypeScript is betterer')
    wrapper.find('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(actions.updateSkill).toHaveBeenCalledWith(expect.anything(), expected, undefined)
    expect(defaultMountingOptions.propsData.close).toHaveBeenCalled()
  })

  it('Should show error message when api call fails', async () => {
    expect.assertions(3)
    const actions = {
      updateSkill: jest.fn((mapActionsStuff, profile, undef) => Promise.reject(new Error('I errored')))
    }
    const mergedConfig = merge({}, defaultStoreConfig, { actions })
    const wrapper = createWrapper(SkillListEditSkill, mergedConfig, defaultMountingOptions)
    wrapper.find('button[type="submit"]').trigger('click')
    await flushPromises()
    expect(actions.updateSkill).toHaveBeenCalled()
    expect(wrapper.find(ApiErrorDetailsPanel).isVisible()).toBeTruthy()
    expect(wrapper.vm.errorDetails).toHaveLength(1)
  })

  it('Should not submit skill when category is not selected', async () => {
    expect.assertions(1)
    const actions = {
      updateSkill: jest.fn(() => Promise.resolve())
    }
    const mergedConfig = merge({}, defaultStoreConfig, { actions })
    const wrapper = createWrapper(SkillListEditSkill, mergedConfig, defaultMountingOptions)
    wrapper.setData({ selectedSkillCategoryId: null })
    wrapper.find('button[type="submit"]').trigger('submit')
    await flushPromises()
    expect(actions.updateSkill).not.toHaveBeenCalled()
  })
})
