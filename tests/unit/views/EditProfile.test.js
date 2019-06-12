import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import EditProfile from '@/views/EditProfile'
import {
  EditLinks,
  EditSkills,
  EditProjects,
  ProfileForm,
  CvInfo
} from '@/components/EditProfile'
import { merge } from 'lodash'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

const mockProfile = { id: 5 }

const mockProfileSkills = [
  {
    createdAt: '2019-04-12T09:56:01.560Z',
    id: 1,
    knows: 4,
    profileId: 5,
    skillId: 1,
    updatedAt: '2019-04-24T14:52:31.390Z',
    visibleInCV: true,
    wantsTo: 2
  },
  {
    createdAt: '2019-04-12T09:56:01.560Z',
    id: 2,
    knows: 3,
    profileId: 5,
    skillId: 2,
    updatedAt: '2019-04-24T14:52:31.390Z',
    visibleInCV: true,
    wantsTo: 3
  },
  {
    createdAt: '2019-04-12T09:56:01.560Z',
    id: 3,
    knows: 5,
    profileId: 6,
    skillId: 1,
    updatedAt: '2019-04-24T14:52:31.390Z',
    visibleInCV: true,
    wantsTo: 4
  }
]

const mockSkills = {
  1: {
    createdAt: '2019-04-12T09:55:59.590Z',
    description: 'Description',
    id: 1,
    name: 'Vue.js',
    skillCategoryId: 1,
    updatedAt: '2019-04-12T09:55:59.590Z'
  },
  2: {
    createdAt: '2019-04-12T09:55:59.590Z',
    description: 'Another description',
    id: 2,
    name: 'Java',
    skillCategoryId: 2,
    updatedAt: '2019-04-12T09:55:59.590Z'
  }
}

function createStore (overrideConfig) {
  const getters = {
    profileById: () => () => mockProfile,
    skills: () => () => mockSkills,
    skillById: () => (id) => mockSkills[id],
    profileSkillsByProfileId: () => (profileId) => mockProfileSkills.filter(skill => skill.profileId === profileId),
    skillGroupBySkillId: () => (id) => { return { title: 'Uncategorized' } }
  }

  const mergedStoreConfig = merge({ getters }, overrideConfig)
  return new Vuex.Store(mergedStoreConfig)
}

function createWrapper (overrideOptions) {
  const mountOptions = {
    localVue,
    store: createStore()
  }
  const mergedOptions = merge(mountOptions, overrideOptions)
  return shallowMount(EditProfile, mergedOptions)
}

describe('EditProfile.vue', () => {
  it('should not display any subcomponents when profile cannot be found', () => {
    const propsData = {
      profileId: NaN
    }
    const store = createStore({
      getters: {
        profileById: () => () => null
      }
    })
    const wrapper = createWrapper({ propsData, store })
    expect(wrapper.find(ProfileForm).exists()).toBeFalsy()
    expect(wrapper.find(CvInfo).exists()).toBeFalsy()
    expect(wrapper.find(EditLinks).exists()).toBeFalsy()
    expect(wrapper.find(EditSkills).exists()).toBeFalsy()
    expect(wrapper.find(EditProjects).exists()).toBeFalsy()
  })

  it('Should show correct components when profileId is not null', () => {
    const propsData = {
      profileId: 5
    }
    const store = createStore({
      getters: {
        skills: () => mockSkills
      }
    })

    const wrapper = createWrapper({ propsData, store })
    const profileFormWrapper = wrapper.find(ProfileForm)
    const cvInfoWrapper = wrapper.find(CvInfo)
    const editSkillsWrapper = wrapper.find(EditSkills)
    const editLinksWrapper = wrapper.find(EditLinks)
    const EditProjectsWrapper = wrapper.find(EditProjects)
    expect(profileFormWrapper.isVisible()).toBeTruthy()
    expect(profileFormWrapper.props().profile).toBe(mockProfile)
    expect(cvInfoWrapper.isVisible()).toBeTruthy()
    expect(cvInfoWrapper.props().profile).toBe(mockProfile)
    expect(editSkillsWrapper.isVisible()).toBeTruthy()
    expect(editSkillsWrapper.props().profileId).toBe(mockProfile.id)
    expect(editLinksWrapper.isVisible()).toBeTruthy()
    expect(editLinksWrapper.props().profile).toBe(mockProfile)
    expect(EditProjectsWrapper.isVisible()).toBeTruthy()
    expect(EditProjectsWrapper.props().profileId).toBe(mockProfile.id)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should call updateProfileSkill when clicking on Show in CV -checkbox', async () => {
    const actions = {
      updateProfileSkill: jest.fn(() => Promise.resolve())
    }
    const store = createStore({ actions })
    const propsData = {
      profileId: 5
    }
    const editSkillsWrapper = mount(EditSkills, { propsData,
      store,
      localVue,
      mocks: {
        $toasted: {
          global: {
            rytmi_success: jest.fn()
          }
        }
      } })

    editSkillsWrapper.find('div[id=visible-in-cv-checkbox-container-1]').trigger('click')
    expect(actions.updateProfileSkill).toHaveBeenCalled()
  })
})
