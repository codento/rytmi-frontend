import { mount, createLocalVue } from '@vue/test-utils'
import { ProjectRow } from '../../src/components/Profile'
import Vuex from 'vuex'

describe('ProjectRow.test.js', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  let getters, store
  beforeEach(() => {
    getters = {
      projectById: () => (arg) => arg
    }
    store = new Vuex.Store({ getters })
  })
  it('Template is correct', () => {
    let wrapper = mount(ProjectRow, {
      store,
      localVue,
      propsData: {
        profileProject: {
          projectId: 1,
          name: 'Testi prkkis',
          description: 'mail',
          startDate: '15.05.2017',
          endDate: '16.06.2017'
        }
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
