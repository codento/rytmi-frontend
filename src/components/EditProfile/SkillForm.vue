<template>
  <b-card
    class="addNew"
    title="Add new skill"
  >
    <b-form @submit="onSubmit">
      <b-form-group
        id="skillLabel"
        vertical
        label="Skill/proficiency name"
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
        id="knows-label"
        label="Proficiency level"
        label-size="lg"
      >
        <EditSkillsLevelSelect
          :options="knowsOptions"
          :initial-value="knows"
          @option-selected="knowsOptionSelected($event)"
        />
      </b-form-group>
      <b-form-group
        v-if="!isLanguageSkill"
        id="wants-to-label"
        label="Willingness level"
        label-size="lg"
      >
        <EditSkillsLevelSelect
          :options="wantsToOptions"
          :initial-value="wantsTo"
          @option-selected="wantsOptionSelected($event)"
        />
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
import proficiencyDesc from '@/assets/proficiencyDesc'
import { orderBy } from 'lodash'
import vSelect from 'vue-select'
import EditSkillsLevelSelect from '@/components/EditProfile/EditSkillsLevelSelect'
import { LANGUAGE_ENUM } from '@/utils/constants'

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
      wantsTo: 0,
      knows: 0
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'profileSkillsByProfileId',
      'skillGroupBySkillId',
      'currentLanguage'
    ]),
    isLanguageSkill () {
      if (this.profileSkill && this.profileSkill.id) {
        const skillGroup = this.skillGroupBySkillId(this.profileSkill.id)
        return skillGroup ? skillGroup.title.en === LANGUAGE_ENUM.LANGUAGE_GROUP_NAME : false
      }
      return false
    },
    knowsOptions () {
      if (this.isLanguageSkill) {
        return proficiencyDesc.knowsLanguage['en']
      }
      return proficiencyDesc.knows['en']
    },
    availableSkillsForVueSelect () {
      const existingSkillsIds = this.profileSkillsByProfileId(this.profileId).map(profileSkill => profileSkill.skillId)
      const allSkillsMappedForVueSelect = Object.values(this.skills).map(skill => ({
        label: skill.name[this.currentLanguage],
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
        wantsTo: this.wantsTo,
        knows: this.knows
      }
      this.addProfileSkill(profileSkill)

      this.profileSkill = null
    },
    knowsOptionSelected (newValue) {
      this.knows = newValue
    },
    wantsOptionSelected (newValue) {
      this.wantsTo = newValue
    }
  }
}
</script>

<style scoped >
.form-label {
  font-weight: bold;
}
</style>
