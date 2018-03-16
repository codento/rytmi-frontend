<template>
  <ul>
    <li v-for='profile in results' :key="profile.userId">
      <b-card>
        <b-row>
          <b-col class="col-sm-4" style="text-align:center">
            <img :src='profile.photoPath' alt="">
            <h3>{{profile.firstName}} {{profile.lastName}}</h3>
            <b>Email: {{profile.email}}</b><br>
            <b>puhelinnumero: {{profile.phone}}</b>
          </b-col>
          <b-col class="col-md-6">
            <b-col>
              <SkillRow v-for='skill in skillsByUserId(profile.id)'
                :name="skillName(skill.skillId)"
                :knows='skill.knows'
                :wants='skill.wantsTo'
                :key='skill.id'>
              </SkillRow>
            </b-col>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="col-md-9"/>
          <b-col class="col-md-3">
            <b-button @click="openProfile(profile)">Go to profile</b-button>
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
    openProfile (profile) {
      this.$router.replace({name: 'Profile', params: { id: profile.id }})
    },
    delaySearch: _.debounce(
      function () {
        this.search = this.param
      },
      200 // Wait between searches can be changed here
    ),
    skillName (skillId) {
      return this.skillById(skillId).name
    },
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
    SkillRow
  }
}
</script>

<style lang="css" />
