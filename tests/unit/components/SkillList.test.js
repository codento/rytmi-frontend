import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import { mount, createLocalVue } from '@vue/test-utils'
import { SkillList } from '@/components/Skills/'
import { format } from 'date-fns'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.filter('dateFilter', value => {
  return value ? format(value, 'D.M.YYYY') : undefined
})

const mockSkills = {
  1: {
    id: 1,
    name: 'JavaScript',
    description: 'Jäsää',
    SkillCategoryId: 1
  },
  2: {
    id: 2,
    name: 'C',
    description: 'old robust shit',
    SkillCategoryId: 2
  }
}
const mockSkillCategories = {
  1: {
    id: 1,
    SkillGroupId: 1,
    title: 'New stuff'
  },
  2: {
    id: 2,
    SkillGroupId: 1,
    title: 'Old stuff'
  }
}

const mockSkillProfiles = [
  {
    description: 'How I know this stuff?',
    id: 1,
    knows: 3,
    profileId: 1,
    skillId: 1,
    visibleInCV: false,
    wantsTo: 2
  },
  {
    description: 'How I know this stuff?',
    id: 2,
    knows: 3,
    profileId: 2,
    skillId: 1,
    visibleInCV: false,
    wantsTo: 5
  }
]

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      skills: () => mockSkills,
      skillCategories: () => mockSkillCategories,
      skillProfiles: () => mockSkillProfiles
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    localVue,
    store: createStore(),
    $options: {
      filters: {
        dateFilter: function (value) {
          return value ? format(value, 'D.M.YYYY') : undefined
        }
      }
    }
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return mount(SkillList, mergedMountingOptions)
};

describe('SkillList.vue', () => {
  it('Should render the list of skills', () => {
    const wrapper = createWrapper()
    const tableRows = wrapper.find('#skill-list-table').findAll('tr')
    expect(tableRows).toHaveLength(3)
  })
})
