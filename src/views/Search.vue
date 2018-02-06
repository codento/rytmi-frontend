<template>
  <div class="animated fadeIn">
    <b-col class="col-sm-3" style="float:left">
      <b-card>
        <h2>Search</h2>
        <p>(Filters by name)</p>
        <input v-model="param"></input>
      </b-card>
    </b-col>
    <b-col class="col-sm-9" style="float:right">
      <ul>
        <li v-for='profile in profileFilter(param)'>
          <b-card>
            <b-row>
              <b-col class="col-sm-4" style="text-align:center">
                <img :src='profile.photoPath' alt="">
                <h3>{{profile.firstName}} {{profile.lastName}}</h3>
                <b>Email: {{profile.email}}</b><br>
                <b>puhelinnumero: {{profile.phone}}</b>
              </b-col>
              <b-col class="skills">
                <SkillRow class="col-sm-6" v-for='skill in skills' :name="skill.name" :proficiency='Math.floor(6 * Math.random())' :key='skill.id'></SkillRow>
              </b-col>
            </b-row>
          </b-card>
        </li>
      </ul>
    </b-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SkillRow from '../components/SkillRow'

export default {
  name: 'Search',
  data () {
    return {
      param: ''
    }
  },
  computed: {
    ...mapGetters([
      'profiles',
      'profileById',
      'profileFilter',
      'skills'
    ])
  },
  components: {
    SkillRow
  },
  created () {
    this.$store.dispatch('fetchProfiles')
    this.$store.dispatch('fetchSkills')
  },
  methods: {
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
}
img {
  object-fit: contain;
  margin-left: 10px
}
</style>
