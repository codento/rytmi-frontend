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
          v-model="sortBy"
          :options="sortOptions"
          buttons
          name="radioBtnStacked" />
      </b-col>
    </b-row>
    <profile-card
      v-for="profile in ordered"
      :key="profile.id"
      :profile="profile"
      :skill-highlight="filteredSkillIds"
    />
  </div>
</template>

<script>
import { isEmpty, intersection, debounce, keyBy, max as _max } from 'lodash'
import { mapGetters } from 'vuex'
import ProfileCard from './ProfileCard'

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
      sortBy: 'name'
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
    ordered () {
      const sortBy = !isEmpty(this.filteredSkillIds) ? this.sortBy : 'name'
      return this.orderMap[sortBy].map(sortItem => this.filteredProfiles[sortItem.profileId])
    },
    orderMap () {
      const orderMap = {
        knows: [],
        wantsTo: [],
        name: []
      }
      const skillFilterCount = this.filteredSkillIds.length
      if (this.filteredProfiles) {
        Object.values(this.filteredProfiles).forEach(profile => {
          const knows = []
          const wantsTo = []
          let count = 0 // Count of skills. Does not count skills where wantsTo and knows are 0.
          this.skillsByProfileId(profile.id).forEach(profileSkill => {
            if (this.filteredSkillIds.includes(profileSkill.skillId) && (profileSkill.wantsTo > 0 || profileSkill.knows > 0)) {
              knows.push(profileSkill.knows)
              wantsTo.push(profileSkill.wantsTo)
              count += 1
            }
          })
          if (count === skillFilterCount) {
            // add to orderMap only if profile has all selected skills.
            orderMap.knows.push({ profileId: profile.id, value: _max(knows) })
            orderMap.wantsTo.push({ profileId: profile.id, value: _max(wantsTo) })
            orderMap.name.push({ profileId: profile.id, value: profile.firstName.toLowerCase() })
          }
        })
        orderMap.knows.sort((a, b) => b.value - a.value)
        orderMap.wantsTo.sort((a, b) => b.value - a.value)
        orderMap.name.sort((a, b) => a.value > b.value ? 1 : -1)
      }
      return orderMap
    }
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
  mounted () {
    this.search()
  },
  methods: {
    delayedSearch: debounce(
      function () {
        this.search()
      },
      200 // Wait between searches can be changed here
    ),
    search () {
      const results = this.profileFilter(this.filterName)
        .filter(profile => {
          if (!isEmpty(this.filteredSkillIds)) {
            const profilesSkills = this.skillsByProfileId(profile.id)
              .filter(profileSkill => {
                return profileSkill.knows > 0 || profileSkill.wantsTo > 0
              })
              .map(profileSkill => profileSkill.skillId)
            const common = intersection(profilesSkills, this.filteredSkillIds)
            return !isEmpty(common)
          }
          return true
        })

      this.filteredProfiles = keyBy(results, 'id')
    }
  }
}
</script>

<style scoped>
.sortbar {
  padding: 8px !important;
}
</style>
