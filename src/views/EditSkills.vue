
'
<template>
  <div class="animated fadeIn">
    <SkillModal v-if="showModal" @close="showModal = false"/>

    <b-container fluid>
      <h1>Taidot</h1>
      <b-row > 
        <b-col v-for="skill, index in skillsByUserId(5)"  class="col-sm-3">
          <div v-on:click="deleteSkill(index)">
          <skill-card :skill="skill" />
          </div>
        </b-col>
        <b-col class="col-sm-3">
          <b-card
          class="addNew"
          title="Add new"
          v-on:click="addNew()"
          />
        </b-col>       
      </b-row>  
    </b-container>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import SkillCard from '../components/SkillCard'
import SkillModal from '../components/SkillModal'

export default {
  name: 'EditProfile',
  components: {
    SkillCard,
    SkillModal
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillsByUserId'
    ])
  },
  methods: {
    ...mapActions([
      'fetchProfileSkills'
    ]),
    deleteSkill (skill) {
      this.profile.skills.splice(skill, 1)
    },
    addNew () {
      const key = Math.floor(Math.random() * Object.keys(this.skills).length) - 1
      this.profile.skills.push(
        {
          name: this.skills[key].name,
          knows: Math.floor(Math.random() * 5),
          wantsTo: Math.floor(Math.random() * 3) + 1,
          id: this.profile.skills.length + 1})
    }
  },
  created () {
    this.fetchProfileSkills()
  },
  data () {
    return {
      showModal: false,
      profile: {
        id: 0,
        skills: [
          {
            name: 'Vue.js',
            knows: 0,
            wantsTo: 2,
            id: 7
          }
        ]
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.card :hover{
  background-color: hsla(34, 100%, 51%, 0.541);

}
</style>
