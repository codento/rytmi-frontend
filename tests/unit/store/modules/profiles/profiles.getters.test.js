import { getters } from '@/store/modules/profiles/getters'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import LANGUAGE_ENUM from '@/utils/constants'

jest.mock('@/utils/api/api')

const localVue = createLocalVue()
localVue.use(Vuex)

const initialState = {
  siteSettings: {
    currentLanguage: LANGUAGE_ENUM.DEFAULT_LANGUAGE
  },
  profileId: 15,
  userProfile: '',
  profiles: {
    15: {
      id: 15,
      cvDescriptions: [
        { description: 'desc1', language: 'en', type: 'introduction' },
        { description: 'kuvaus1', language: 'fi', type: 'introduction' },
        { description: 'markdown desc', language: 'en', type: 'other' },
        { description: 'markdown kuvaus', language: 'fi', type: 'other' }
      ]
    },
    16: {
      id: 16,
      cvDescriptions: [
        { description: 'desc2', language: 'en', type: 'introduction' },
        { description: 'kuvaus2', language: 'fi', type: 'introduction' }
      ]
    }
  },
  profileList: [],
  profileSkills: [],
  profileProjectList: {},
  futurePpList: {}
}

const store = new Vuex.Store({ state: initialState, getters: getters })

describe('Profiles.getters', () => {
  it('should return the profiles ', () => {
    expect(store.getters.profiles).toBe(initialState.profiles)
  })

  it('should return the correct profile with given id, dscriptions filtered by language', () => {
    const defaultDescriptions = initialState.profiles[15].cvDescriptions
      .filter(cvDescription => cvDescription.language === LANGUAGE_ENUM.DEFAULT_LANGUAGE)
    expect(store.getters.profileById(15)).toEqual(
      {
        id: 15,
        cvDescriptions: initialState.profiles[15].cvDescriptions,
        introduction: defaultDescriptions.filter(item => item.type === 'introduction').description,
        otherInfo: defaultDescriptions.filter(item => item.type === 'other').description
      }
    )
  })
})
