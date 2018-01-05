import moment from 'moment'

const filters = {
  date: value => {
    return value ? moment(value).format('DD.MM.YYYY') : ''
  }
}

export default {
  install (Vue) {
    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    })
  }
}
