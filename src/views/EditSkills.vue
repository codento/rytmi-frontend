<template>
  <div class="animated fadeIn">
    <b-container fluid>
      <h1>Taidot</h1>
      <b-row>
        <b-col class="col-sm-3">
          <skill-form :profileId="profileId" />
        </b-col>
        <b-col class="col-sm-9">
          <b-row>
            <b-col v-for="skill in skillsByUserId(profileId)" class="col-sm-3" :key="skill.id">
              <div v-on:click="removeProfileSkill({profileId: profileId, id: skill.id})">
                <skill-card :skill="skill" />
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SkillForm from '../components/SkillForm'
import SkillCard from '../components/SkillCard'
export default {
  name: 'EditSkills',
  components: {
    SkillForm,
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
      'removeProfileSkill'
    ])
  },
  data () {
    return {
      showModal: false
    }
  }
}
</script>

<style scoped>
</style>