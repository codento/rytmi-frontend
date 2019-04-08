import { mount, createLocalVue } from '@vue/test-utils'
import { ProjectRow } from '@/components/Common'
import Vuex from 'vuex'
import { format } from 'date-fns'

describe('ProjectRow.test.js', () => {
  let localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.filter('dateFilter', value => {
    return value ? format(value, 'D.M.YYYY') : undefined
  })
  let getters, state, store
  beforeEach(() => {
    getters = {
      projectById: () => (arg) => arg
    }
    state = {
      language: { currentLanguage: 'fi' }
    }
    store = new Vuex.Store({ getters, state })
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
