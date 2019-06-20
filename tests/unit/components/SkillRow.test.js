import { mount, createLocalVue } from '@vue/test-utils'
import { SkillRow } from '@/components/Common'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(BootstrapVue)

const getters = {
  profileById: () => (arg) => arg,
  profiles: () => (arg) => arg,
  skillsById: () => (arg) => arg,
  skillName: () => (skillId) => 'Python'
}
const store = new Vuex.Store({ getters })

describe('UserProfileCard.test.js', () => {
  it('Template is correct', () => {
    let wrapper = mount(SkillRow, {
      store,
      localVue,
      propsData: {
        'id': 1,
        'skillId': 1,
        'wantsTo': 1,
        'knows': 2,
        'description': 'fdfas'
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
