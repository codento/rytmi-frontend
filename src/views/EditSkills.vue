<template>
  <div class="animated fadeIn">
    <b-container fluid>
      <h1>Skills</h1>
      <b-row>
        <b-col v-for="skill, index in skillsByUserId(profileId)" class="col-sm-3" :key='skill.id'>
          <div v-on:click="deleteSkill(index)">
            <skill-card :skill="skill" class="skillCard" />
          </div>
        </b-col>
        <b-col class="col-sm-3">
          <b-card
            class="addNew"
            title="Add new">
            <b-form @submit="onSubmit">
              <b-form-group
                vertical
                id="skillLabel"
                label="Skill:"
                label-for="skill">
                <b-form-select
                  id="skill"
                  v-model="profileSkill.skillId"
                  :options="availableSkills"
                  value-field="id"
                  text-field="name">
                  <template slot="first">
                    <option :value="null" disabled>-- Select skill --</option>
                  </template>
                </b-form-select>
              </b-form-group>
              <b-form-group
                id="description"
                vertical
                label="Description:"
                label-for="descriptionInput">
                <b-form-textarea
                    id="descriptionInput"
                    :rows="3"
                    type="text"
                    v-model="profileSkill.description"
                    placeholder="Short description">
                </b-form-textarea>
              </b-form-group>
              <b-form-group
                id="wantsToLabel"
                vertical
                label="Wants:"
                label-for="wantsTo">
                <b-form-input
                  id="wantsTo"
                  type="range"
                  min="0"
                  max="5"
                  v-model="profileSkill.wantsTo">
                </b-form-input>
              </b-form-group>
              <b-form-group
                id="knowsLabel"
                vertical
                label="Knows:"
                label-for="knows">
                <b-form-input
                  id="knows"
                  type="range"
                  min="0"
                  max="5"
                  v-model="profileSkill.knows">
                </b-form-input>
              </b-form-group>
              <b-form-group
                id="visibleInCVLabel"
                vertical
                label="Show in CV:"
                label-for="visibleInCV">
                <input type="checkbox"
                  id="visibleInCV"
                  v-model="profileSkill.visibleInCV">
              </b-form-group>
              <b-button type="submit" variant="primary">Submit</b-button>
              <b-button @click="onReset" variant="danger">Clear</b-button>
            </b-form>
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
