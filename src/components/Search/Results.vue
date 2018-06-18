<template>
  <ul class="search-results">
    <li v-for='profile in results' :key="profile.userId">
      <b-card>
        <b-row>
          <b-col class="col-12 col-md-3" style="text-align:center">
            <span @click="openProfile(profile)" style="cursor: pointer">
              <img :src='profile.photoPath' alt="">
              <h3>{{profile.firstName}} {{profile.lastName}}</h3>
            </span>
            <b>{{profile.email}}</b><br>
            <b>{{profile.phone}}</b>
          </b-col>
          <b-col class="col-12 col-md-4 align-self-center">
            <UtilizationChart :projects="futureProfileProjectsByProfileId(profile.id)" />
          </b-col>
          <b-col class="col-12 col-md-4 align-self-center" style="margin-top: 1em;">
            <SkillRow v-for='skill in skillsByProfileId(profile.id)'
              :name="skillName(skill.skillId)"
              :skillId='skill.id'
              :knows='skill.knows'
              :wants='skill.wantsTo'
              :desc='skill.description'
              :key='skill.id'>
            </SkillRow>
          </b-col>
          <b-col class="col-12 col-md-1 profile-open-button">
              <b-button @click="openProfile(profile)">
                <i style="font-size: 76px; color: gray;" class="fa fa-5x fa-angle-right"></i>
              </b-button>
          </b-col>
        </b-row>
      </b-card>
    </li>
  </ul>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { SkillRow, UtilizationChart } from '../Profile'

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
  components: {
    SkillRow,
    UtilizationChart
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'skillsByProfileId',
      'skillById',
      'futureProfileProjectsByProfileId'
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
      this.$router.push({name: 'profile', params: { id: profile.id }})
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
      let skills = this.skillsByProfileId(profile.id)
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
  }
}
</script>

<style lang="css" />
