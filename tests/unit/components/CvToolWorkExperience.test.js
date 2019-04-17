import _ from 'lodash'

import { CvToolWorkExperience } from '@/components/Profile'
import { ProjectRow } from '@/components/Common'
import { state, getters, actions, mutations } from '@/store/modules/cvTool/index'
import { createShallowWrapper } from './setup/setup'

const storeConfig = {
  state: state,
  getters: _.merge(getters, { skillFilter: () => { return [] } }),
  actions: actions,
  mutations: mutations
}

const additionalMountingOptions = {
  propsData: {
    profileProjects: [
      { id: 1, projectId: 10, endDate: '2019-12-04T21:51:49.963Z' },
      { id: 2, projectId: 20, endDate: '2019-12-01T21:51:49.963Z' },
      { id: 3, projectId: 30, endDate: '2019-12-02T22:50:41.000Z' },
      { id: 4, projectId: 40, endDate: '2019-12-02T22:50:41.001Z' }
    ]
  }
}

describe('CvToolWorkExperience.test.js', () => {
  it('Should show correct components', () => {
    const wrapper = createShallowWrapper(CvToolWorkExperience, storeConfig, additionalMountingOptions)
    expect(wrapper.findAll(ProjectRow).length).toBe(4)
    expect(wrapper.findAll('input').length).toBe(4)
  })

  it('Should disable selection when maximum skills are selected', () => {
    const wrapper = createShallowWrapper(CvToolWorkExperience, storeConfig, additionalMountingOptions)
    wrapper.setData({ maxSelected: 2 })
    wrapper.setData({ selectedProjects: [1, 2] })
    expect(wrapper.vm.isNotSelectable(3)).toBeTruthy()
  })

  it('Should select by default latest 3 (maxSelexted=3) projects', () => {
    const wrapper = createShallowWrapper(CvToolWorkExperience, storeConfig, additionalMountingOptions)
    expect(wrapper.vm.selectedProjects).toEqual([10, 40, 30])
  })
})
