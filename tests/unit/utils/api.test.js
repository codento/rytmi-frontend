import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import * as api from '../../../src/utils/api'
const API_URL = 'http://localhost:8081/api'
const PATH_AUTH = '/auth'
const PATH_SKILLS = '/skills'
const PATH_PROFILES = '/profiles'
const PATH_PROFILESKILLS = '/profileskills'
const token = 'kargfayj63trfcjshgerfkjhsaghfy'

describe('API Calls', () => {
  beforeEach(() => {
    process.env = { API_URL }
  })
  it('GET skills', () => {
    let mockAdapter = new MockAdapter(axios)

    mockAdapter.onGet(API_URL + PATH_SKILLS).reply(200, {
      skills: ['My skills', 'Second skills']
    })
    expect.assertions(1)
    return api.getSkills(token).then(response => {
      expect(response.data.skills[0]).toBe('My skills')
    })
  })
  it('GET profiles', () => {
    let mockAdapter = new MockAdapter(axios)

    mockAdapter.onGet(API_URL + PATH_PROFILES + '/all').reply(200, {
      skills: ['My profile', 'Second profile']
    })
    expect.assertions(1)
    return api.getProfiles(token).then(response => {
      expect(response.data.skills[0]).toBe('My profile')
    })
  })
  it('GET profileskills', () => {
    let mockAdapter = new MockAdapter(axios)

    mockAdapter.onGet(API_URL + PATH_PROFILESKILLS).reply(200, {
      skills: ['My profileskills', 'Second profileskills']
    })
    expect.assertions(1)
    return api.getProfileSkills(token).then(response => {
      expect(response.data.skills[0]).toBe('My profileskills')
    })
  })
  it('POST newProfileSkill (data, token)', () => {
    let mockAdapter = new MockAdapter(axios)
    let data = {
      profileId: '1',
      skill: ['new skill']
    }
    mockAdapter.onPost(API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS).reply(201)
    expect.assertions(1)
    return api.newProfileSkill(data, token).then(response =>
      expect(response.status).toBe(201))
  })
  it('PUT alterProfile (data, token)', () => {
    let mockAdapter = new MockAdapter(axios)
    let data = {
      profileId: '1',
      name: 'john doe'
    }
    mockAdapter.onPut(API_URL + PATH_PROFILES + '/' + data.id).reply(204)
    expect.assertions(1)
    return api.alterProfile(data, token).then(response =>
      expect(response.status).toBe(204))
  })
  it('POST login (token)', () => {
    let mockAdapter = new MockAdapter(axios)
    let token = 'kjkjhjahmbneruvemjhkvjabkj'

    mockAdapter.onPost(API_URL + PATH_AUTH).reply(200)
    expect.assertions(1)
    return api.login(token).then(response =>
      expect(response.status).toBe(200))
  })
})
