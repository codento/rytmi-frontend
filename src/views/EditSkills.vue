
'
<template>
  <div class="animated fadeIn">
    <b-container fluid>
      <h1>Taidot</h1>
      <b-row > 
        <b-col v-for="skill, index in skillsByUserId(profileId)"  class="col-sm-3">
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

export default {
  name: 'EditProfile',
  components: {
    SkillCard
  },
  props: {
    'profileId': Number
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillsByUserId'
    ])
  },
  methods: {
    ...mapActions([
      'addProfileSkill',
      'deleteProfileSkill'
    ]),
    addNew () {
      const request = {
        id: this.profileId,
        body: {
          skillId: Math.floor(Math.random() * Object.keys(this.skills).length) - 1,
          knows: Math.floor(Math.random() * 5),
          wantsTo: Math.floor(Math.random() * 3) + 1,
          visibleInCV: true,
          description: 'blah'
        }
      }
      this.addProfileSkill(request)
    }
  },
  data () {
    return {
      showModal: false
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
