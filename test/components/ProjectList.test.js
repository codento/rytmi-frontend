import { mount, createLocalVue } from 'vue-test-utils'
import { ProjectList } from '../../src/components/Project'
import Vuex from 'vuex'

const localVue = createLocalVue()

localVue.use(Vuex)

const getters = {
  projects: () => (arg) => arg,
  projectFilter: () => (arg) => arg
}
const store = new Vuex.Store({ getters })

describe('ProjectList.test.js', () => {
  it('Template is correct', () => {
    let wrapper = mount(ProjectList, {
      store,
      localVue
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
