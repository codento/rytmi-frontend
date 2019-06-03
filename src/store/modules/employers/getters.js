export default {
  employers: (state) => state.employers,
  employerById: (state) => (id) => state.employers[id]
}
