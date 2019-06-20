import { mount, createLocalVue } from '@vue/test-utils'
import { ProjectRow } from '@/components/Common'
import Vuex from 'vuex'
import { format } from 'date-fns'

const mockProject = {
  projectId: 1,
  name: { fi: 'Testi prkkis' },
  description: { fi: 'mail' },
  startDate: '2017-05-15',
  endDate: '2017-06-16'
}

describe('ProjectRow.test.js', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.filter('dateFilter', value => {
    return value ? format(value, 'D.M.YYYY') : undefined
  })
  let getters, state, store
  beforeEach(() => {
    getters = {
      projectById: () => (arg) => mockProject,
      currentLanguage: () => 'fi'
    }
    state = {
      siteSettings: { currentLanguage: 'fi' }
    }
    store = new Vuex.Store({ getters, state })
  })
  it('Template is correct', () => {
    let wrapper = mount(ProjectRow, {
      store,
      localVue,
      propsData: {
        profileProject: mockProject
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
