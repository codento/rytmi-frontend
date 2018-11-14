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
      filteredProfiles: {}, //TODO Poista tämä kun uusi toteutus profiileista, joissa on skillit mukana, on toteutettu      
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
        { text: 'Name', value: 'name' }
      ]
      if (!isEmpty(this.filterSkills)) {
        options.push(...[
          { text: 'Proficiency', value: 'knows' },
          { text: 'Willingness', value: 'wantsTo' }
        ])
      }
      return options
    },
    filteredSkillIds () {
      return this.filterSkills.map(skill => skill.id)
    },
    orderedProfiles () {      
      //Filter by skill(s)
      let filteredProfilesWithSkills = this.profilesWithSkills
      console.log(filteredProfilesWithSkills)
      this.filteredSkillIds.forEach(skillId => {
        filteredProfilesWithSkills = this.getProfilesBySkill(filteredProfilesWithSkills, skillId)
      })

      //Sort profiles

      //TODO: Sorting

      //Mapped skills aren't needed anymore from this point on, return only profiles
      
      return filteredProfilesWithSkills.map(profileWithSkills => profileWithSkills.profile)
    },

    //TODO: Delete outcommented function
    // orderMap () {
    //   const orderMap = {
    //     knows: [],
    //     wantsTo: [],
    //     name: []
    //   }
    //   const skillFilterCount = this.filteredSkillIds.length
    //   if (this.filteredProfiles) {
    //     Object.values(this.filteredProfiles).forEach(profile => {
    //       const knows = []
    //       const wantsTo = []
    //       let countOfSkills = 0 //Skills where wantsTo and knows are 0 aren't taken into account.
    //       this.skillsByProfileId(profile.id).forEach(profileSkill => {
    //         if (this.filteredSkillIds.includes(profileSkill.skillId) && (profileSkill.wantsTo > 0 || profileSkill.knows > 0)) {
    //           knows.push(profileSkill.knows)
    //           wantsTo.push(profileSkill.wantsTo)
    //           countOfSkills += 1
    //         }
    //       })
    //       if (countOfSkills === skillFilterCount) {
    //         // add to orderMap only if profile has all selected skills.
    //         orderMap.knows.push({ profileId: profile.id, value: _max(knows) })
    //         orderMap.wantsTo.push({ profileId: profile.id, value: _max(wantsTo) })
    //         orderMap.name.push({ profileId: profile.id, value: profile.firstName.toLowerCase() })
    //       }
    //     })
    //     orderMap.knows.sort((a, b) => b.value - a.value)
    //     orderMap.wantsTo.sort((a, b) => b.value - a.value)
    //     orderMap.name.sort((a, b) => a.value > b.value ? 1 : -1)
    //   }
    //   return orderMap
    // }    
  },
  watch: {
    filterName: function () {
      this.delayedSearch()
    },
    profiles: function () {
      this.search()
    },
    filterSkills (newValue, oldValue) {
      if (isEmpty(newValue)) this.sortBy = 'name'
      if (isEmpty(oldValue)) this.sortBy = 'knows'
    }
  },
  created() { //TODO: would mounted() work?
    this.search()
  },
  methods: {
    delayedSearch: debounce(
      function () {
        this.search()
      },
      200 // Wait between searches can be changed here
    ),
    search() {
      this.profilesWithSkills = this.mapSkillsToProfiles()    
    },    
    getProfilesBySkill (profilesToFilter, skillId) {
      let matchingProfiles = profilesToFilter.filter(profile => profile.skills.filter(skill => skill.skillId === skillId).length > 0)
      return matchingProfiles
    },
    mapSkillsToProfiles () {      

      let profilesWithSkills = []
      Object.values(this.profileFilter()).forEach(profile => {             
        let personsSkills = this.skillsByProfileId(profile.id)
        console.log(personsSkills)  
        profilesWithSkills.push({
          profile: profile,
          skills: personsSkills
        })        
      })      
      return profilesWithSkills
    },
    sortProfiles (profilesWithSkills) {      
      
    }
  }
}
</script>

<style scoped>
.sortbar {
  padding: 8px !important;
}
</style>
