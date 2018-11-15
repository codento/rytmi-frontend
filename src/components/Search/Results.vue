<template>
  <div>
    <b-row
      class="sortbar"
      align-h="end"
    >
      <b-col
        cols="12"
        class="text-right"
      >
        <small>Sort profiles by: </small>
        <b-form-radio-group
          id="btnradios"
          v-model="sortAttribute"
          :options="sortOptions"
          buttons
          name="radioBtnStacked" />
      </b-col>
    </b-row>
    <profile-card
      v-for="profile in orderedProfiles"
      :key="profile.id"
      :profile="profile"
      :skill-highlight="filteredSkillIds"
    />
  </div>
</template>

<script>
import { isEmpty, intersection, debounce, keyBy, max as _max, sortBy } from 'lodash'
import { mapGetters } from 'vuex'
import ProfileCard from './ProfileCard'
const sortAttributeEnum = Object.freeze({name:1, wantsTo:2, knows:3})

export default {
  name: 'Results',
  components: {
    ProfileCard
  },
  props: {
    filterName: String,
    filterSkills: Array
  },
  data () {
    return {
      filteredProfiles: {},   
      sortAttribute: sortAttributeEnum.name,
      profilesWithSkills: null
    }
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'skillsByProfileId',
      'profiles'
    ]),
    sortOptions () {
      const options = [
        { text: 'Name', value: sortAttributeEnum.name }
      ]
      if (!isEmpty(this.filterSkills)) {
        options.push(...[
          { text: 'Proficiency', value: sortAttributeEnum.knows },
          { text: 'Willingness', value: sortAttributeEnum.wantsTo }
        ])
      }
      return options
    },
    filteredSkillIds () {
      return this.filterSkills.map(skill => skill.id)
    },
    orderedProfiles () {      
      
      //Every profile with skills, already filtered by name
      let filteredProfilesWithSkills = this.mapSkillsToProfiles()
      
      //Filter by skill(s)
      this.filteredSkillIds.forEach(skillId => {
        filteredProfilesWithSkills = this.getProfilesBySkill(filteredProfilesWithSkills, skillId)
      })

      //Sort profiles
      filteredProfilesWithSkills = this.sortProfiles(filteredProfilesWithSkills)

      //Mapped skills aren't needed anymore from this point on, return only profiles      
      return filteredProfilesWithSkills.map(profileWithSkills => profileWithSkills.profile)
    },  
  },  
  methods: {
    getProfilesBySkill (profilesToFilter, skillId) {
      return profilesToFilter.filter(profile => profile.skills.filter(skill => skill.skillId === skillId).length > 0)
    },
    mapSkillsToProfiles () {      
      //First, get profiles, filtered by name
      const profilesWithoutSkills = Object.values(this.profileFilter(this.filterName))
      //Then map skills for each profile
      const profilesWithSkills = []
      profilesWithoutSkills.forEach(profile => {             
        profilesWithSkills.push({
          profile: profile,
          skills: this.skillsByProfileId(profile.id)
        })        
      })      
      return profilesWithSkills
    },
    sortProfiles (profilesWithSkills) {
      if (this.sortAttribute === sortAttributeEnum.name) {        
        return sortBy(profilesWithSkills, ['profile.firstName'])  
      }
      if (this.sortAttribute === sortAttributeEnum.wantsTo || this.sortAttribute === sortAttributeEnum.knows) { //Redundant if, but clarifies code.
          if (this.filteredSkillIds.length < 1) {
            return profilesWithSkills
          }
          const skillToSortBy = this.filteredSkillIds[0] //TODO: What should be done here if several skills are selected?
          const propertyToSortBy = (this.sortAttribute === sortAttributeEnum.wantsTo ? "wantsTo" : "knows")
          return profilesWithSkills.sort(function (profile1, profile2) {
            const profile1SkillLevel = getProfileSkill(profile1, skillToSortBy, propertyToSortBy)
            const profile2SkillLevel = getProfileSkill(profile2, skillToSortBy, propertyToSortBy)        
            return profile2SkillLevel - profile1SkillLevel
          })         
      }

      function getProfileSkill(profile, skillId, propertyToReturn) {
        return profile.skills.filter(skill => skill.skillId === skillId)[0][propertyToReturn]
      }
    }
  }
}
</script>

<style scoped>
.sortbar {
  padding: 8px !important;
}
</style>
