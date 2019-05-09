import { getters } from '@/store/modules/profiles/getters'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

jest.mock('@/utils/api/api')

const localVue = createLocalVue()
localVue.use(Vuex)

const initialState = {
  siteSettings: {
    currentLanguage: 'fi'
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
    },
    17: {
      id: 17,
      cvDescriptions: []
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

  it('Should return the correct profile with given id, and show introduction and other info using correct language', () => {
    expect(store.getters.profileById(15)).toEqual(
      {
        id: 15,
        cvDescriptions: initialState.profiles[15].cvDescriptions,
        introduction: 'kuvaus1',
        otherInfo: 'markdown kuvaus'
      }
    )
  })

  it('Should work with some descriptions missing', () => {
    expect(store.getters.profileById(16)).toEqual(
      {
        id: 16,
        cvDescriptions: initialState.profiles[16].cvDescriptions,
        introduction: 'kuvaus2'
      }
    )
  })

  it('Should work with all descriptions missing', () => {
    expect(store.getters.profileById(17)).toEqual(
      {
        id: 17,
        cvDescriptions: initialState.profiles[17].cvDescriptions
      }
    )
  })
})
