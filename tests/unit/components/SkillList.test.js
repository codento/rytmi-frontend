import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import { mount, createLocalVue } from '@vue/test-utils'
import { SkillList, EditSkill } from '@/components/Skills/'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

const mockSkills = {
  1: {
    id: 1,
    name: 'JavaScript',
    description: 'Jäsää',
    SkillCategoryId: 1
  },
  2: {
    id: 2,
    name: 'C',
    description: 'old robust shit',
    SkillCategoryId: 2
  }
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

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      skills: () => mockSkills,
      skillCategories: () => mockSkillCategories,
      skillProfiles: () => mockSkillProfiles
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    localVue,
    store: createStore()
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return mount(SkillList, mergedMountingOptions)
};

describe('SkillList.vue', () => {
  it('Should render the list of skills', () => {
    const wrapper = createWrapper()
    const tableRows = wrapper.find('#skill-list-table').findAll('tr')
    expect(tableRows).toHaveLength(3)
  })

  it('Should open modal to edit skill when skill is clicked', () => {
    const wrapper = createWrapper()
    const firstRow = wrapper.find('#skill-list-table').findAll('tr').at(1)
    expect(wrapper.find(EditSkill).exists()).toBeFalsy()
    firstRow.trigger('click')
    expect(wrapper.vm.selectedSkill.name).toBe('C')
    expect(wrapper.find(EditSkill).exists()).toBeTruthy()
  })

  it('Should hide the EditSkillModal', () => {
    const wrapper = createWrapper()
    wrapper.setData({ selectedSkill: mockSkills[1] })
    expect(wrapper.find(EditSkill).exists()).toBeTruthy()
    wrapper.vm.closeEditModal()
    expect(wrapper.vm.selectedSkill).toBe(null)
    expect(wrapper.find(EditSkill).exists()).toBeFalsy()
  })
})
