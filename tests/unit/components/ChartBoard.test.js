import _ from 'lodash'
import ChartBoard from '@/components/Dashboard/ChartBoard'
import SkillChart from '@/components/Dashboard/SkillChart'
import TopSkillChart from '@/components/Dashboard/TopSkillChart'
import MostWillingnessChart from '@/components/Dashboard/MostWillingnessChart'
import ConsultantUtilizationChart from '@/components/Dashboard/ConsultantUtilizationChart'
import ConsultantUtilizationList from '@/components/Dashboard/ConsultantUtilizationList'
import { createShallowWrapper } from './setup/setup'
import { LANGUAGE_ENUM } from '@/utils/constants'

const storeConfig = {
  actions: {
    updateProfile: jest.fn()
  },
  getters: {
    appInitialized: () => true,
    profileList: () => [{ id: 1, name: 'Foo' }, { id: 2, name: 'Bar' }],
    employeeRoles: () => {
      return [
        { id: 1, title: 'administrative' },
        { id: 2, title: 'hardcore soft engineer' },
        { id: 3, title: 'software destroyer' }
      ]
    },
    profileById: () => (arg) => {
      return {
        id: arg,
        userId: 2,
        firstName: 'Bar',
        lastName: 'Foo',
        photoPath: '',
        employeeRoles: [2],
        title: 'software developer',
        email: 'foo.bar@foo.com',
        phone: '1354'
      }
    },
    skillGroupBySkillId: () => (id) => mockSkillGroups[id]
  }
}

const mockSkills = {
  1: { id: 1, name: 'SkillOne' },
  2: { id: 2, name: 'SkillTwo' },
  3: { id: 3, name: 'LanguageOne' }
}

const mockSkillGroups = {
  1: { id: 100, title: { en: 'SomeGroup', fi: 'SomeGroup' } },
  2: { id: 100, title: { en: 'SomeGroup', fi: 'SomeGroup' } },
  3: { id: 200, title: { en: LANGUAGE_ENUM.LANGUAGE_GROUP_NAME, fi: '' } }
}

const mockSkillProfiles = [
  { skillId: 1, knows: 3, wantsTo: 4 },
  { skillId: 2, knows: 1, wantsTo: 0 },
  { skillId: 2, knows: 5, wantsTo: 5 }
]

describe('ChartBoard.vue', () => {
  it('should not show any charts when skills array is empty and loading has been done', () => {
    const getters = {
      skills: () => ({}),
      skillProfiles: () => mockSkillProfiles
    }
    const overrideStoreConfigs = _.merge(storeConfig, { getters })
    const wrapper = createShallowWrapper(ChartBoard, overrideStoreConfigs)
    expect(wrapper.find('#no-data-message').isVisible()).toBeTruthy()
    expect(wrapper.find(SkillChart).exists()).toBeFalsy()
  })

  it('should not show any charts when skillProfiles array is empty and loading has been done', () => {
    const getters = {
      skills: () => mockSkills,
      skillProfiles: () => []
    }
    const overrideStoreConfigs = _.merge(storeConfig, { getters })
    const wrapper = createShallowWrapper(ChartBoard, overrideStoreConfigs)
    expect(wrapper.find('#no-data-message').isVisible()).toBeTruthy()
    expect(wrapper.find(SkillChart).exists()).toBeFalsy()
  })

  it('should show SkillChart, TopSkillChart, MostWillingnessChart, ConsultantUtilizationChart', () => {
    const getters = {
      skills: () => mockSkills,
      skillProfiles: () => mockSkillProfiles
    }
    const overrideStoreConfigs = _.merge(storeConfig, { getters })
    const wrapper = createShallowWrapper(ChartBoard, overrideStoreConfigs)
    expect(wrapper.find(TopSkillChart).isVisible()).toBeTruthy()
    expect(wrapper.find(MostWillingnessChart).isVisible()).toBeTruthy()
    expect(wrapper.find(SkillChart).isVisible()).toBeTruthy()
    expect(wrapper.find(ConsultantUtilizationList).isVisible()).toBeTruthy()
    const utilizationChart = wrapper.find(ConsultantUtilizationChart)
    expect(utilizationChart.isVisible()).toBeTruthy()
    expect(utilizationChart.vm.activeRoleSelection.length).toEqual(2)
  })

  it('createEmptySkillObject should create object with skill id\'s as properties, languages should be ignored', () => {
    const expected = {
      1: {
        name: 'SkillOne',
        proficiencies: [],
        willingness: []
      },
      2: {
        name: 'SkillTwo',
        proficiencies: [],
        willingness: []
      }
    }
    const getters = {
      skills: () => mockSkills,
      skillProfiles: () => mockSkillProfiles
    }
    const overrideStoreConfigs = _.merge(storeConfig, { getters })
    const wrapper = createShallowWrapper(ChartBoard, overrideStoreConfigs)
    expect(wrapper.vm.createEmptySkillObject(wrapper.vm.skillList)).toEqual(expected)
  })

  it('groupSkillProfileBySkill should group profiles by skill, languages should be ignored', () => {
    const expected = {
      1: {
        name: 'SkillOne',
        proficiencies: [3],
        willingness: [4]
      },
      2: {
        name: 'SkillTwo',
        proficiencies: [1, 5],
        willingness: [0, 5]
      }
    }
    const getters = {
      skills: () => mockSkills,
      skillProfiles: () => mockSkillProfiles
    }
    const overrideStoreConfigs = _.merge(storeConfig, { getters })
    const wrapper = createShallowWrapper(ChartBoard, overrideStoreConfigs)
    expect(wrapper.vm.groupSkillProfilesBySkill(wrapper.vm.skillList)).toEqual(expected)
  })

  it('skillInfo should have skills by id with profiencies & willingess & averages of those two', () => {
    const expected = {
      1: {
        name: 'SkillOne',
        proficiencies: [3],
        willingness: [4],
        proficiencyAverage: 3,
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
    const getters = {
      skills: () => mockSkills,
      skillProfiles: () => mockSkillProfiles
    }
    const overrideStoreConfigs = _.merge(storeConfig, { getters })
    const wrapper = createShallowWrapper(ChartBoard, overrideStoreConfigs)
    expect(wrapper.vm.skillInfo).toEqual(expected)
  })
})
