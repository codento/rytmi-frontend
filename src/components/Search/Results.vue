<template lang="html">
  <ul>
    <li v-for='profile in profileFilter(search)'>
      <b-card>
        <b-row>
          <b-col class="col-sm-4" style="text-align:center">
            <img :src='profile.photoPath' alt="">
            <h3>{{profile.firstName}} {{profile.lastName}}</h3>
            <b>Email: {{profile.email}}</b><br>
            <b>puhelinnumero: {{profile.phone}}</b>
          </b-col>
          <b-col class="skills">
            <SkillRow class="col-sm-6" v-for='skill in skills' :name="skill.name" :proficiency='4' :key='skill.id'></SkillRow>
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
      search: ''
    }
  },
  props: {
    param: String
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'skills'
    ])
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
    )
  },
  components: {
    SkillRow
  },
  created () {
    this.$store.dispatch('fetchProfiles')
    this.$store.dispatch('fetchSkills')
  }
}
</script>

<style lang="css">
</style>
