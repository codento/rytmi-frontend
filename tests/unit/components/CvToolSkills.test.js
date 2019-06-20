import _ from 'lodash'

import { CvToolSkills } from '@/components/Profile'
import { SkillRow } from '@/components/Common'
import { getters } from '@/store/modules/cvTool/getters'
import { actions } from '@/store/modules/cvTool/actions'
import { mutations } from '@/store/modules/cvTool/mutations'
import { createShallowWrapper } from './setup/setup'

const initialState = {
  cvIntroduction: '',
  topSkills: [],
  topProjects: []
}

const defaultStoreConfig = {
  state: initialState,
  getters: getters,
  actions: actions,
  mutations: mutations
}

const additionalMountingOptions = {
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

describe('CvToolSkills.test.js', () => {
  it('Should show correct components', () => {
    const wrapper = createShallowWrapper(CvToolSkills, defaultStoreConfig, additionalMountingOptions)
    expect(wrapper.findAll(SkillRow).length).toBe(6)
    expect(wrapper.findAll('input').length).toBe(3) // languages can't be selected
  })

  it('Should disable selection when maximum skills are selected', () => {
    const wrapper = createShallowWrapper(CvToolSkills, defaultStoreConfig, additionalMountingOptions)
    wrapper.setData({ maxSelected: 2 })
    wrapper.setData({ selectedSkills: [1, 2] })
    expect(wrapper.vm.isNotSelectable(3)).toBeTruthy()
  })

  it('Should pre-select skills if skill filter is active (from search)', () => {
    const skillFilter = {
      getters: {
        skillFilter: () => {
          return [
            { id: 10 },
            { id: 20 }
          ]
        }
      }
    }
    const overrideStoreConfigs = _.merge({}, defaultStoreConfig, skillFilter)
    const wrapper = createShallowWrapper(CvToolSkills, overrideStoreConfigs, additionalMountingOptions)
    expect(wrapper.vm.selectedSkills).toEqual([10, 20])
  })

  it('Should not fail if skill filter contains skills not visible in cv', () => {
    const skillFilter = {
      getters: {
        skillFilter: () => {
          return [
            { id: 90 },
            { id: 20 }
          ]
        }
      }
    }
    const overrideStoreConfigs = _.merge({}, defaultStoreConfig, skillFilter)
    const wrapper = createShallowWrapper(CvToolSkills, overrideStoreConfigs, additionalMountingOptions)
    expect(wrapper.vm.selectedSkills).toEqual([20])
  })

  it('Computed property skillsByCategory should group skills by category', () => {
    const wrapper = createShallowWrapper(CvToolSkills, defaultStoreConfig, additionalMountingOptions)
    expect(wrapper.vm.skillsByCategory.length).toEqual(2)
    expect(wrapper.vm.skillsByCategory.filter(item => item.category === 'A').length).toEqual(1)
    expect(wrapper.vm.skillsByCategory.find(item => item.category === 'A').skills.length).toEqual(2)
    expect(wrapper.vm.skillsByCategory.find(item => item.category === 'B').skills.length).toEqual(1)
  })
})
