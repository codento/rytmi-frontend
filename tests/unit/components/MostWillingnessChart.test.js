import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import MostWillingessChart from '@/components/Dashboard/MostWillingnessChart'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    localVue
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(MostWillingessChart, mergedMountingOptions)
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
    proficiencies: [2, 5, 5],
    willingness: [2, 5, 5],
    proficiencyAverage: 4,
    willingnessAverage: 4
  }
}

describe('MostWillingnessChart.vue', () => {
  it('Should render chart with text telling information about the most wanted skill', () => {
    const propsData = {
      skillInfo: mockSkillInfo
    }
    const expected = { name: 'SkillTwo', currentKnowledgeAverage: 4, numberOfPeople: 2 }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.vm.mostWillingnessToWorkWith).toEqual(expected)
  })

  it('Template is correct', () => {
    const propsData = {
      skillInfo: mockSkillInfo
    }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.element).toMatchSnapshot()
  })
})
