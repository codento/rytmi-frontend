<template>
  <b-card
    class="addNew"
    title="Add new"
  >
    <b-form @submit="onSubmit">
      <b-form-group
        id="skillLabel"
        vertical
        label="Skill"
        label-for="skill"
        label-size="lg"
      >
        <v-select
          id="skill-select"
          v-model="profileSkill"
          :options="availableSkillsForVueSelect"
          placeholder="Select skill"
          select-on-tab
        />
      </b-form-group>
      <b-form-group
        id="knowsLabel"
        label="Proficiency level"
        label-size="lg"
      >
        <EditSkillsLevelSelect
          :options="knowsOptions"
          :initial-value="0"
          @option-selected="knowsOptionSelected($event)"
        />
      </b-form-group>
      <b-form-group
        id="wantsToLabel"
        label="Willingness level"
        label-size="lg"
      >
        <EditSkillsLevelSelect
          :options="wantsToOptions"
          :initial-value="0"
          @option-selected="wantsOptionSelected($event)"
        />
      </b-form-group>
      <b-form-group
        id="visibleInCVLabel"
        vertical
        label="Show in CV"
        label-for="visibleInCV"
        label-size="lg"
      >
        <input
          id="visibleInCV"
          v-model="visibleInCV"
          type="checkbox"
        >
      </b-form-group>
      <b-button
        id="submit-skill"
        type="submit"
        variant="primary"
      >
        Add skill
      </b-button>
    </b-form>
  </b-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import proficiencyDesc from '../../assets/proficiencyDesc'
import { orderBy } from 'lodash'
import vSelect from 'vue-select'
import EditSkillsLevelSelect from '@/components/EditProfile/EditSkillsLevelSelect'

export default {
  name: 'SkillForm',
  components: {
    vSelect,
    EditSkillsLevelSelect
  },
  props: {
    'profileId': {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      profileSkill: null,
      wantsToOptions: proficiencyDesc.wants,
      knowsOptions: proficiencyDesc.knows['en'],
      visibleInCV: true,
      wantsTo: 0,
      knows: 0
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'profileSkillsByProfileId'
    ]),
    availableSkillsForVueSelect () {
      const existingSkillsIds = this.profileSkillsByProfileId(this.profileId).map(profileSkill => profileSkill.skillId)
      const allSkillsMappedForVueSelect = Object.values(this.skills).map(skill => ({
        label: skill.name,
        id: skill.id
      }))
      return orderBy(allSkillsMappedForVueSelect.filter(skill => !existingSkillsIds.includes(skill.id)), [skill => skill.label.toLowerCase()])
    }
  },
  methods: {
    ...mapActions(['addProfileSkill']),
    onSubmit (evt) {
      evt.preventDefault()
      const profileSkill = {
        name: this.profileSkill.label,
        skillId: this.profileSkill.id,
        profileId: this.profileId,
        visibleInCV: this.visibleInCV,
        wantsTo: this.wantsTo,
        knows: this.knows
      }
      this.addProfileSkill(profileSkill)

      this.profileSkill = null
      this.visibleInCV = true
      this.wantsTo = 0
      this.knows = 0
    },
    knowsOptionSelected (newValue) {
      this.knows = newValue
    },
    wantsOptionSelected (newValue) {
      this.wants = newValue
    }
  }
}
</script>

<style scoped >
.form-label {
  font-weight: bold;
}
</style>
