import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import TopSkillChart from '@/components/Dashboard/TopSkillChart'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    localVue
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(TopSkillChart, mergedMountingOptions)
}

const mockSkillInfo = {
  1: {
    name: 'SkillOne',
    proficiencies: [2],
    willingness: [4],
    proficiencyAverage: 2,
    willingnessAverage: 4
  },
  2: {
    name: 'SkillTwo',
    proficiencies: [1, 5],
    willingness: [0, 5],
    proficiencyAverage: 3,
    willingnessAverage: 2.5
  }
}

describe('TopSkillChart.vue', () => {
  it('Should render chart with text telling information about the top skill', () => {
    const propsData = {
      skillInfo: mockSkillInfo
    }
    const expected = { name: 'SkillTwo', currentKnowledgeAverage: 3, numberOfPeople: 1 }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.vm.topSkillLevel).toEqual(expected)
  })

  it('Should match the template', () => {
    const propsData = {
      skillInfo: mockSkillInfo
    }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.element).toMatchSnapshot()
  })
})
