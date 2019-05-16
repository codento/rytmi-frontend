export default {
  profileEmployers: state => state.profileEmployers,
  profileEmployersByProfileId: state => profileId => {
    return state.profileEmployers.filter(profileEmployer => profileEmployer.profileId === profileId)
  }
}
