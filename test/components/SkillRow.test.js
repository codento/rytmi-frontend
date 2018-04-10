import { mount, createLocalVue } from 'vue-test-utils'
import { SkillRow } from '../../src/components/Profile'
import Vuex from 'vuex'

const localVue = createLocalVue()

localVue.use(Vuex)

const getters = {
  profileById: () => (arg) => arg,
  profiles: () => (arg) => arg,
  skillsById: () => (arg) => arg
}
const store = new Vuex.Store({ getters })

describe('UserProfileCard.test.js', () => {
  it('Template is correct', () => {
    let wrapper = mount(SkillRow, {
      store,
      localVue,
      propsData: {
        'skillId': 1,
        'name': 'Python',
        'wants': 1,
        'knows': 2,
        'desc': 'fdfas'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
