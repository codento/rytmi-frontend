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
        basicInformation: {
          proficiency: 121231312,
          name: 'mail'
        }
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
