import LANGUAGE_ENUM from '@/utils/constants'
import * as getters from '@/store/modules/skills/getters'
import * as skillCategoryGetters from '@/store/modules/skillCategories/getters'
import * as skillGroupGetters from '@/store/modules/skillGroups/getters'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

jest.mock('@/utils/api/api')

const localVue = createLocalVue()
localVue.use(Vuex)

const mockSkills = {
  1: { id: 1, name: 'SkillOne', skillCategoryId: 10 },
  2: { id: 2, name: 'SkillTwo', skillCategoryId: 10 },
  3: { id: 3, name: 'LanguageOne', skillCategoryId: 20 }
}

const mockSkillCategories = {
  10: { id: 10, title: 'SomeCategory', skillGroupId: 100 },
  20: { id: 20, title: LANGUAGE_ENUM.LANGUAGE_GROUP_NAME, skillGroupId: 200 }
}

const mockSkillGroups = {
  100: { id: 100, title: 'SomeGroup' },
  200: { id: 200, title: LANGUAGE_ENUM.LANGUAGE_GROUP_NAME }
}

const initialState = {
  siteSettings: {
    currentLanguage: 'fi'
  },
  skillCategories: {
    skillCategories: mockSkillCategories
  },
  skillGroups: {
    skillGroups: mockSkillGroups
  },
  skills: mockSkills,
  skillList: [],
  skillFilter: []
}
const mockSkillCategoryModule = {
  state: {
    skillCategories: mockSkillCategories
  },
  getters: skillCategoryGetters
}
const mockSkillGroupModule = {
  state: {
    skillGroups: mockSkillGroups
  },
  getters: skillGroupGetters
}
const store = new Vuex.Store({ state: initialState, getters: getters, modules: { mockSkillCategoryModule, mockSkillGroupModule } })

describe('Skills.getters', () => {
  it('should return the skills ', () => {
    expect(store.getters.skills).toBe(initialState.skills)
  })

  it('Should return the correct skill category for skill', () => {
    expect(store.getters.skillCategoryBySkillId(1)).toEqual(mockSkillCategories[10])
  })

  it('Should return the correct skill group for skill', () => {
    expect(store.getters.skillGroupBySkillId(1)).toEqual(mockSkillGroups[100])
  })
})
