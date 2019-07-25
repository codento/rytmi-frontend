<template>
  <div>
    <h3>{{ skill.id ? 'Edit skill' : 'Add new skill' }}</h3>
    <hr>
    <b-form @submit.prevent="submitSkill">
      <small for="edit-skill-name">Skill name *</small>
      <b-form-group
        :invalid-feedback="inputState.name.feedback"
      >
        <b-form-input
          id="edit-skill-name"
          v-model="name"
          type="text"
          required
          :state="inputState.name.state"
          @focus="showSimilarSkills = true"
          @blur="dirtyFields.name = true"
        />
        <b-row>
          <b-col cols="12">
            <div v-if="showSimilarSkills && similarSkillNames.length > 0">
              <div class="mt-2">
                <small>
                  Existing skills with a similar name
                </small>
              </div>
              <div
                v-for="skillName in similarSkillNames"
                :key="skillName"
                :class="`existing-skill-item mx-1 my-1 ${matchesExistingSkill ? 'highlighted-skill' : ''}`"
              >
                {{ skillName }}
              </div>
            </div>
          </b-col>
        </b-row>
      </b-form-group>
      <small for="edit-skill-category">Skill category *</small>
      <b-form-group
        :invalid-feedback="inputState.selectedSkillCategoryId.feedback"
      >
        <b-select
          id="edit-skill-category"
          v-model="selectedSkillCategoryId"
          :options="skillCategoryOptions"
          required
          :state="inputState.selectedSkillCategoryId.state"
        />
      </b-form-group>
      <small for="edit-skill-description">Skill description</small>
      <b-form-textarea
        id="edit-skill-description"
        v-model="description"
        :rows="4"
        placeholder="Short description for skill if needed"
      />
    </b-form>
    <b-row
      v-if="errorDetails.length > 0"
      class="mt-3 text-danger"
    >
      <ApiErrorDetailsPanel :error-details="errorDetails" />
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <b-button
          id="save-edits"
          type="submit"
          variant="primary"
          class="mr-2"
          @click.prevent="submitSkill()"
        >
          Save edits
        </b-button>
        <b-button
          id="cancel-edits"
          type="button"
          variant="light"
          @click="close()"
        >
          Cancel
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import ApiErrorDetailsPanel from '../helpers/ApiErrorDetailsPanel.vue'

export default {
  name: 'SkillListEditSkill',
  components: {
    ApiErrorDetailsPanel
  },
  props: {
    skill: Object,
    close: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      originalName: this.skill.name || '',
      name: this.skill.name || '',
      description: this.skill.description || '',
      selectedSkillCategoryId: this.skill.skillCategoryId || null,
      showSimilarSkills: false,
      errorDetails: [],
      validated: false,
      dirtyFields: {
        name: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillCategories',
      'currentLanguage'
    ]),
    skillCategoryOptions () {
      return Object.values(this.skillCategories).map(category => {
        return { value: category.id, text: category.title[this.currentLanguage] }
      }).sort((a, b) => a.text.localeCompare(b.text))
    },
    matchesExistingSkill () {
      const skillNames = Object.values(this.skills).map(skill => skill.name)
      return skillNames.some(name => {
        return name.toLowerCase() === this.name.toLowerCase() && name.toLowerCase() !== this.originalName.toLowerCase()
      })
    },
    similarSkillNames () {
      if (isEmpty(this.name)) {
        return []
      }
      const skillNames = Object.values(this.skills).map(skill => skill.name)
      const matchingSkillNames = skillNames.filter(skillName => skillName.toLowerCase().includes(this.name.toLowerCase()) && skillName !== this.originalName)
      return matchingSkillNames.sort()
    },
    inputState () {
      return {
        name: {
          state: this.validated || this.dirtyFields.name ? this.name.length > 0 && !this.matchesExistingSkill : undefined,
          feedback: this.name.length > 0 ? 'Skill name must be unique' : 'Skill name can\'t be empty'
        },
        selectedSkillCategoryId: {
          state: this.validated ? this.selectedSkillCategoryId !== null : undefined,
          feedback: 'Skill category can\'t be empty'
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'addSkill',
      'updateSkill'
    ]),
    async submitSkill () {
      this.validated = true
      this.errorDetails = []
      const isNewSkill = this.skill.id === null
      const skill = {
        name: this.name,
        description: this.description,
        skillCategoryId: this.selectedSkillCategoryId
      }
      if (!Object.values(this.inputState).every(item => item.state)) {
        return
      }
      try {
        if (isNewSkill) {
          await this.addSkill(skill)
        } else {
          skill.id = this.skill.id
          await this.updateSkill(skill)
        }
        this.$toasted.global.rytmi_success({
          message: isNewSkill ? `Skill ${this.name} added` : 'Skill updated'
        })
        this.validated = false
        this.showSimilarSkills = false
        this.close()
      } catch (error) {
        if (error.response) {
          if (Array.isArray(error.response.data.error.details)) {
            this.errorDetails = error.response.data.error.details
          } else {
            this.errorDetails.push(error.response.data.error.details)
          }
        } else {
          this.errorDetails.push(error.message)
        }
        this.$toasted.global.rytmi_error({
          message: isNewSkill ? `Error adding skill: \n ${this.errorDetails}` : `Error updating skill: \n ${this.errorDetails}`
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.existing-skill-item {
  float: left;
  padding: 5px 10px;
  background-color: $c-light;
  border-radius: 10px;
}
.highlighted-skill {
  border: 1px solid #f86c6b;
}
</style>
