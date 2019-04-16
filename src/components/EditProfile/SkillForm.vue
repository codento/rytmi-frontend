<template>
  <b-card
    class="addNew"
    title="Add new"
  >
    <b-form @submit="onSubmit">
      <b-form-group
        id="skillLabel"
        vertical
        label="Skill:"
        label-for="skill"
      >
        <b-form-select
          id="skill"
          v-model="profileSkill.skillId"
          :options="availableSkills"
          value-field="id"
          text-field="name"
          required
        >
          <template slot="first">
            <option
              :value="null"
              disabled
            >
              -- Select skill --
            </option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group
        id="description"
        vertical
        label="Description:"
        label-for="descriptionInput"
      >
        <b-form-textarea
          id="descriptionInput"
          v-model="profileSkill.description"
          :rows="3"
          type="text"
          placeholder="Short description"
        />
      </b-form-group>
      <b-form-group
        id="knowsLabel"
        label="Proficiency level:"
      >
        <b-form-radio-group
          id="knows"
          v-model="profileSkill.knows"
          :options="knowsOptions"
          stacked
          plain
        />
      </b-form-group>
      <b-form-group
        id="wantsToLabel"
        label="Willingness level:"
      >
        <b-form-radio-group
          id="wantsTo"
          v-model="profileSkill.wantsTo"
          :options="wantsToOptions"
          stacked
          name="wantsTo"
          plain
        />
      </b-form-group>
      <b-form-group
        id="visibleInCVLabel"
        vertical
        label="Show in CV:"
        label-for="visibleInCV"
      >
        <input
          id="visibleInCV"
          v-model="profileSkill.visibleInCV"
          type="checkbox"
        >
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
      >
        Submit
      </b-button>
      <b-button
        variant="danger"
        @click="onReset"
      >
        Clear
      </b-button>
    </b-form>
  </b-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import proficiencyDesc from '../../assets/proficiencyDesc'
import { filter } from 'lodash'
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
  name: 'SkillForm',
  props: {
    'profileId': {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      profileSkill: skillTemplate(),
      wantsToOptions: proficiencyDesc.wants,
      knowsOptions: proficiencyDesc.knows
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'profileSkillsByProfileId'
    ]),
    availableSkills () {
      const existingSkills = this.profileSkillsByProfileId(this.profileId)
        .map(profileSkill => profileSkill.skillId)
      return filter(this.skills, (value, key) =>
        existingSkills.indexOf(value.id) === -1
      )
    }
  },
  methods: {
    ...mapActions(['addProfileSkill']),
    onSubmit (evt) {
      evt.preventDefault()
      this.profileSkill.profileId = this.profileId
      this.addProfileSkill(this.profileSkill)
      this.profileSkill = skillTemplate()
    },
    onReset () {
      this.profileSkill = skillTemplate()
    }
  }
}
</script>

<style scoped />
