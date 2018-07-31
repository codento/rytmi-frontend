import { mount, createLocalVue } from 'vue-test-utils'
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
          startDate: '2017-05-15',
          endDate: '2017-06-16'
        }
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
