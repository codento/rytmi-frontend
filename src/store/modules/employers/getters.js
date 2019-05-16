export default {
  employers: state => state.employers,
  employerById: state => id => {
    return state.employers[id]
  }
}
