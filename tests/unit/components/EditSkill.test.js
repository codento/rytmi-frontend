import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { EditSkill } from '@/components/Skills/'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

const mockSkill = {
  id: 1,
  name: 'JavaScript',
  description: 'Jäsää',
  SkillCategoryId: 1
}

const mockSkillCategories = {
  1: {
    id: 1,
    SkillGroupId: 1,
    title: 'New stuff'
  },
  2: {
    id: 2,
    SkillGroupId: 1,
    title: 'Old stuff'
  }
}

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    actions: {
      updateSkill: jest.fn(),
      deleteSkill: jest.fn()
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    localVue,
    propsData: {
      skill: mockSkill,
      skillCategories: mockSkillCategories,
      close: jest.fn(),
      peopleWithSkill: 2
    },
    store: createStore()
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return mount(EditSkill, mergedMountingOptions)
};

describe('EditSkill.vue', () => {
  it('Should show form with skill props data', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[type="text"]').element.value).toBe(mockSkill.name)
    expect(wrapper.vm.selectedSkillCategory).toBe(mockSkillCategories[1])
    expect(wrapper.find('textarea').element.value).toBe(mockSkill.description)
  })

  it('Should submit the edited skill and call close', async () => {
    expect.assertions(3)
    const actions = {
      updateSkill: jest.fn(() => Promise.resolve())
    }
    const propsData = {
      close: jest.fn()
    }
    const expected = {
      id: 1,
      name: 'TypeScript',
      description: 'TypeScript is betterer',
      SkillCategoryId: 1
    }
    const store = createStore({ actions })
    const wrapper = createWrapper({ store, propsData })
    wrapper.find('input[type="text"]').setValue('TypeScript')
    wrapper.find('textarea').setValue('TypeScript is betterer')
    wrapper.find('button[type="submit"]').trigger('submit')
    expect(wrapper.vm.loading).toBeTruthy()
    await flushPromises()
    expect(actions.updateSkill).toHaveBeenCalledWith(expect.anything(), expected, undefined)
    expect(propsData.close).toHaveBeenCalled()
  })

  it('Should show error message when api call fails', async () => {
    expect.assertions(4)
    const actions = {
      updateSkill: jest.fn(() => Promise.reject(new Error('I errored')))
    }
    const propsData = {
      close: jest.fn()
    }
    const store = createStore({ actions })
    const wrapper = createWrapper({ store, propsData })
    wrapper.find('button[type="submit"]').trigger('submit')
    expect(wrapper.vm.loading).toBeTruthy()
    await flushPromises()
    expect(actions.updateSkill).toHaveBeenCalled()
    expect(wrapper.vm.loading).toBeFalsy()
    expect(wrapper.find('#error-message').text()).toContain('I errored')
  })

  it('Should not submit skill when category is not selected', async () => {
    expect.assertions(2)
    const actions = {
      updateSkill: jest.fn(() => Promise.resolve())
    }
    const store = createStore({ actions })
    const wrapper = createWrapper({ store })
    wrapper.setData({ selectedSkillCategory: null })
    wrapper.find('button[type="submit"]').trigger('submit')
    await flushPromises()
    expect(wrapper.vm.categoryNotSelected).toBe(true)
    expect(actions.updateSkill).not.toHaveBeenCalled()
  })

  it('Should show the confirm delete dialog adn close it when cancel is clicked', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('#confirm-dialog').exists()).toBeFalsy()
    wrapper.find('#delete-dialog-btn').trigger('click')
    const confirmDialog = wrapper.find('#confirm-dialog')
    expect(confirmDialog.exists()).toBeTruthy()
    expect(confirmDialog.find('#confirm-message').text()).toContain(`There are currently 2 persons`)
    wrapper.find('#cancel-confirm-delete-btn').trigger('click')
    expect(wrapper.find('#confirm-dialog').exists()).toBeFalsy()
  })

  it('Should call the delete action the skill and call close', async () => {
    expect.assertions(2)
    const actions = {
      deleteSkill: jest.fn(() => Promise.resolve())
    }
    const propsData = {
      close: jest.fn()
    }
    const store = createStore({ actions })
    const wrapper = createWrapper({ store, propsData })
    wrapper.setData({ deleteDialogOpen: true })
    wrapper.find('#confirm-delete-btn').trigger('click')
    await flushPromises()
    expect(actions.deleteSkill).toHaveBeenCalledWith(expect.anything(), mockSkill.id, undefined)
    expect(propsData.close).toHaveBeenCalled()
  })
})
