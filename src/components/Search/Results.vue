<template lang="html">
  <ul>
    <li v-for='profile in results'>
      <b-card>
        <b-row>
          <b-col class="col-md-4" style="text-align:center">
            <img :src='profile.photoPath' alt="">
            <h3>{{profile.firstName}} {{profile.lastName}}</h3>
            <b>Email: {{profile.email}}</b><br>
            <b>puhelinnumero: {{profile.phone}}</b>
          </b-col>
          <b-col class="col-md-6">
            <br>
            <b-col>
              <h3>Skills:</h3>
              <SkillRow v-for='skill in skillsByUserId(profile.userId)'
                :name="skillName(skill.skillId)"
                :proficiency='skill.knows'
                :key='skill.id'>
              </SkillRow>
            </b-col>
            <br>
            <b-col>
              <h3>Willingnes:</h3>
              <SkillRow v-for='skill in skillsByUserId(profile.userId)'
                :name="skillName(skill.skillId)"
                :proficiency='skill.wantsTo'
                :key='skill.id'>
              </SkillRow>
            </b-col>
          </b-col>
        </b-row>
      </b-card>
    </li>
  </ul>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'

import SkillRow from '../SkillRow'

export default {
  name: 'Results',
  data () {
    return {
      search: '',
      sortable: []
    }
  },
  props: {
    param: String,
    active: Array
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'skillsByUserId',
      'skillById'
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
      500
    ),
    skillName (skillId) {
      return this.skillById(skillId).name
    },
    hasSkill (profile, skillToSearch, multipleSkills) {
      let skills = this.skillsByUserId(profile.id)
      for (let i = 0; i < skills.length; i++) {
        if (skills[i].skillId === skillToSearch) {
          if (multipleSkills) {
            this.updateSortable(profile, skills[i].knows)
          } else {
            if (skills[i].knows > 0) {
              this.sortable.push([profile, skills[i].knows])
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
    SkillRow
  },
  created () {
    this.$store.dispatch('fetchSkills')
    this.$store.dispatch('fetchProfiles')
    this.$store.dispatch('fetchProfileSkills')
  }
}
</script>

<style lang="css">
</style>
