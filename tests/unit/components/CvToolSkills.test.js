import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import _ from 'lodash'

import { CvToolSkills } from '@/components/Profile'
import { SkillRow } from '@/components/Common'
import { state, getters, mutations, actions } from '@/store/modules/cvTool/index'
import { createStore } from './setup/createTestStore'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

function createWrapper (overrideMountingOptions, overrideStoreConfigs) {
  const cvToolStore = {
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations
  }
  const defaultStoreConfigs = {
    getters: {
      skillFilter: () => { return [] }
    }
  }
  const defaultMountingOptions = {
    localVue,
    store: createStore(_.merge(cvToolStore, defaultStoreConfigs, overrideStoreConfigs)),
    propsData: {
      skills: [
        { id: 1, skillId: 10, skillCategory: 'A' },
        { id: 2, skillId: 20, skillCategory: 'A' },
        { id: 3, skillId: 30, skillCategory: 'B' }
      ],
      languages: [
        { id: 4, skillId: 40, skillCategory: 'C' },
        { id: 5, skillId: 50, skillCategory: 'C' },
        { id: 6, skillId: 60, skillCategory: 'C' }
      ]
    }
  }
  const mergedMountingOptions = _.merge(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(CvToolSkills, mergedMountingOptions)
}

describe('CvToolSkills.test.js', () => {
  it('Should show correct components', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll(SkillRow).length).toBe(6)
    expect(wrapper.findAll('input').length).toBe(3) // languages can't be selected
  })

  it('Should disable selection when maximum skills are selected', () => {
    const wrapper = createWrapper()
    wrapper.setData({ maxSelected: 2 })
    wrapper.setData({ selectedSkills: [1, 2] })
    expect(wrapper.vm.isNotSelectable(3)).toBeTruthy()
  })

  it('Should pre-select skills if skill filter is active (from search)', () => {
    const skillFilter = {
      getters: {
        skillFilter: () => {
          return [
            { id: 1, skillId: 10 },
            { id: 2, skillId: 20 }
          ]
        }
      }
    }
    const wrapper = createWrapper({}, skillFilter)
    expect(wrapper.vm.selectedSkills).toEqual([1, 2])
  })

  it('Computed property skillsByCategory should group skills by category', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.skillsByCategory.length).toEqual(2)
    expect(wrapper.vm.skillsByCategory.filter(item => item.category === 'A').length).toEqual(1)
    expect(wrapper.vm.skillsByCategory.find(item => item.category === 'A').skills.length).toEqual(2)
    expect(wrapper.vm.skillsByCategory.find(item => item.category === 'B').skills.length).toEqual(1)
  })
})
