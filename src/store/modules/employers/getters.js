export default {
  employers: state => state.employers,
  employerById: state => id => {
    return state.employers[id]
  },
  employerByName: (state) => (name) => {
    return Object.values(state.employers).filter(employer => employer.name === name)[0]
  }
}
