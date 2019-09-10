<template>
  <div>
    <h3>{{ skill.id ? 'Edit skill' : 'Add new skill' }}</h3>
    <hr>
    <b-form @submit.prevent="submitSkill">
      <b-row>
        <b-col cols="6">
          <small for="edit-skill-name-fi">Skill name (in Finnish) *</small>
          <b-form-group
            :invalid-feedback="inputState.name.fi.feedback"
          >
            <b-form-input
              id="edit-skill-name-fi"
              v-model="name.fi"
              type="text"
              required
              :state="inputState.name.fi.state"
              @focus="changeFocus('fi')"
              @blur="dirtyFields.name.fi = true"
            />
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <small for="edit-skill-name-en">Skill name (in English) *</small>
          <b-form-group
            :invalid-feedback="inputState.name.en.feedback"
          >
            <b-form-input
              id="edit-skill-name-en"
              v-model="name.en"
              type="text"
              required
              :state="inputState.name.en.state"
              @focus="changeFocus('en')"
              @blur="dirtyFields.name.en = true"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row
        v-if="showSimilarSkills && similarSkillNames.length > 0"
        class="mb-4"
      >
        <b-col cols="12">
          <div>
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
      <b-row>
        <b-col cols="6">
          <small for="edit-skill-description-fi">Skill description (in Finnish)</small>
          <b-form-textarea
            id="edit-skill-description-fi"
            v-model="description.fi"
            :rows="6"
            placeholder="Short description for skill if needed (in Finnish)"
          />
        </b-col>
        <b-col cols="6">
          <small for="edit-skill-description-en">Skill description (in English)</small>
          <b-form-textarea
            id="edit-skill-description-en"
            v-model="description.en"
            :rows="6"
            placeholder="Short description for skill if needed (in English)"
          />
        </b-col>
      </b-row>
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
      originalName: {
        fi: this.skill.name ? this.skill.name.fi : '',
        en: this.skill.name ? this.skill.name.en : ''
      },
      name: {
        fi: this.skill.name ? this.skill.name.fi : '',
        en: this.skill.name ? this.skill.name.en : ''
      },
      description: {
        fi: this.skill.description ? this.skill.name.fi : '',
        en: this.skill.description ? this.skill.name.en : ''
      },
      selectedSkillCategoryId: this.skill.skillCategoryId || null,
      showSimilarSkills: false,
      errorDetails: [],
      validated: false,
      focusedNameLanguage: this.currentLanguage,
      dirtyFields: {
        name: { fi: false, en: false }
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
    similarSkillNames () {
      if (isEmpty(this.name[this.focusedNameLanguage])) {
        return []
      }
      const skillNames = Object.values(this.skills).map(skill => skill.name[this.focusedNameLanguage])
      const matchingSkillNames = skillNames.filter(skillName => skillName.toLowerCase().includes(this.name[this.focusedNameLanguage].toLowerCase()) && skillName !== this.originalName[this.focusedNameLanguage])
      return matchingSkillNames.sort()
    },
    inputState () {
      return {
        name: {
          fi: {
            state: this.validated || this.dirtyFields.name.fi ? this.name.fi.length > 0 && !this.matchesExistingSkill('fi') : undefined,
            feedback: this.name.fi.length > 0 ? 'Skill name must be unique' : 'Skill name can\'t be empty'
          },
          en: {
            state: this.validated || this.dirtyFields.name.en ? this.name.en.length > 0 && !this.matchesExistingSkill('en') : undefined,
            feedback: this.name.en.length > 0 ? 'Skill name must be unique' : 'Skill name can\'t be empty'
          }
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
    matchesExistingSkill (langKey) {
      const skillNames = Object.values(this.skills).map(skill => skill.name[langKey])
      return skillNames.some(name => {
        return name.toLowerCase() === this.name[langKey].toLowerCase() && name.toLowerCase() !== this.originalName[langKey].toLowerCase()
      })
    },
    changeFocus (langKey) {
      this.focusedNameLanguage = langKey
      this.showSimilarSkills = true
    },
    async submitSkill () {
      this.validated = true
      this.errorDetails = []
      const isNewSkill = this.skill.id === null
      const skill = {
        name: this.name,
        description: this.description,
        skillCategoryId: this.selectedSkillCategoryId
      }
      if (!Object.values(this.inputState).every(item => item.state ? item.state : item.fi.state && item.en.state)) {
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
          message: isNewSkill ? `Skill ${this.name[this.currentLanguage]} added` : 'Skill updated'
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
