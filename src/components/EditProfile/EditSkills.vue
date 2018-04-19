<template>
  <div class="animated fadeIn">
    <b-container fluid>
      <h1>Proficiency</h1>
      <b-row>
        <b-col class="col-sm-3">
          <skill-form :profileId="profileId" />
        </b-col>
        <b-col class="col-sm-9">
          <b-row>
            <b-col v-for="skill in skillsByProfileId(profileId)" class="col-sm-3" :key="skill.id">
              <skill-card :skill="skill" @removeSkill="removeSkillFromProfile" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SkillForm from './SkillForm'
import SkillCard from './SkillCard'

export default {
  name: 'EditSkills',
  props: {
    'profileId': Number
  },
  components: {
    SkillForm,
    SkillCard
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillsByProfileId'
    ])
  },
  methods: {
    ...mapActions([
      'removeProfileSkill'
    ]),
    removeSkillFromProfile (skillId) {
      this.removeProfileSkill({profileId: this.profileId, id: skillId})
    }
  }
}
</script>

<style scoped />
