import axios from 'axios'

const ENDPOINT = process.env.API_URL + 'projects'

export default {
  getAll () {
    return axios.get(ENDPOINT)
  }
}
