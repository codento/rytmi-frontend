<template>
  <div>
    <div v-for="profile, index in results" :key="index">
      <profile-preview :profile="profile"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import ProfilePreview from './ProfilePreview.vue'

export default {
  name: 'Results',
  props: {
    param: String,
    selected: String,
    active: Array
  },
  data () {
    return {
      search: '',
      sortable: []
    }
  },
  computed: {
    ...mapGetters([
      'profileFilter'
    ]),
    results: function () {
      let results = this.profileFilter(this.search)
      if (this.active.length > 0) {
        this.sortable = []
        for (let i = 0; i < this.active.length; i++) {
          results = results.filter((profile) => this.hasSkill(profile, this.active[i].id, i))
        }
        return this.sorted()
      }
      return results
    }
  },
  watch: {
    param: function () {
      this.delaySearch()
    }
  },
  methods: {
    delaySearch: _.debounce(
      function () {
        this.search = this.param
      },
      100 // Wait between searches can be changed here
    ),
    hasSkill (profile, skillToSearch, multipleSkills) {
      let skills = this.skillsByUserId(profile.id)
      for (let i = 0; i < skills.length; i++) {
        if (skills[i].skillId === skillToSearch) {
          if (multipleSkills) {
            this.updateSortable(profile, skills[i][this.selected])
          } else {
            if (skills[i][this.selected] > 0) {
              this.sortable.push([profile, skills[i][this.selected]])
            } else {
              return false
            }
          }
          return true
        }
      }
      if (multipleSkills) {
        this.updateSortable(profile, 0)
      }
      return false
    },
    updateSortable: function (profile, value) {
      for (let i = 0; i < this.sortable.length; i++) {
        if (this.sortable[i][0].id === profile.id) {
          if (value) {
            this.sortable[i][1] = this.sortable[i][1] + value
          } else {
            this.sortable.splice(i, 1)
          }
        }
      }
    },
    sorted: function () {
      this.sortable.sort(function (a, b) {
        return b[1] - a[1]
      })
      let sortedResults = []
      for (let j = 0; j < this.sortable.length; j++) {
        sortedResults.push(this.sortable[j][0])
      }
      return sortedResults
    }
  },
  components: {
    ProfilePreview
  }
}
</script>

<style lang="css" />
