<template>
  <div class="animated fadeIn">
    <b-container fluid>
      <h1>Skills</h1>
      <b-row>
        <b-col v-for="skill, index in skillsByUserId(profileId)" class="col-sm-3">
          <div v-on:click="deleteSkill(index)">
            <skill-card :skill="skill" class="skillCard" />
          </div>
        </b-col>
        <b-col class="col-sm-3">
          <b-card
            class="addNew"
            title="Add new"
            :profileId="profileId" >
           <edit-form/>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import SkillCard from '../components/SkillCard'
const skillTemplate = () => {
  return {
    skillId: null,
    knows: 0,
    wantsTo: 0,
    description: '',
    visibleInCV: true
  }
}

export default {
  name: 'EditSkills',
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
    ]),
    availableSkills () {
      const existingIds = this.skillsByUserId(this.profileId)
        .map(profileSkill => profileSkill.skillId)
      return this.$lodash.filter(this.skills, (value, key) => {
        return existingIds.indexOf(value.id) === -1
      })
    }
  },
  methods: {
    ...mapActions([
      'addProfileSkill',
      'deleteProfileSkill'
    ]),
    onSubmit () {
      this.profileSkill.profileId = this.profileId
      this.addProfileSkill(this.profileSkill)
      this.profileSkill = skillTemplate()
    },
    onReset () {
      this.profileSkill = skillTemplate()
    }
  },
  data () {
    return {
      profileSkill: skillTemplate()
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.skillCard :hover{
  background-color: hsla(34, 100%, 51%, 0.541);

}

</style>
