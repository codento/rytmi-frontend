<template>
  <div class="animated fadeIn">
    <b-container fluid>
      <h1>Taidot</h1>
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
