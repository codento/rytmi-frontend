<template>
  <div>
    <h3>{{ skill.id ? 'Edit skill' : 'Add new skill' }}</h3>
    <hr>
    <b-form>
      <small for="edit-skill-name">Skill name</small>
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
        />
        <div v-if="showSimilarSkills && similarSkillNames.length > 0">
          <div class="mt-2">
            <small>
              Existing skills with a similar name
            </small>
          </div>
          <div
            v-for="skillName in similarSkillNames"
            :key="skillName"
            class="existing-skill-item mx-1 my-1"
          >
            {{ skillName }}
          </div>
        </div>
      </b-form-group>
      <small for="edit-skill-category">Skill category</small>
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
          variant="success"
          class="mr-2"
          :disabled="!Object.values(inputState).every(item => item.state)"
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
      originalName: this.skill.name ? this.skill.name : '',
      name: this.skill.name ? this.skill.name : '',
      description: this.skill.description ? this.skill.description : '',
      selectedSkillCategoryId: this.skill.skillCategoryId ? this.skill.skillCategoryId : null,
      showSimilarSkills: false,
      errorDetails: []
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillCategories'
    ]),
    skillCategoryOptions () {
      return Object.values(this.skillCategories).map(category => {
        return { value: category.id, text: category.title }
      }).sort((a, b) => a.text.localeCompare(b.text))
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
          state: this.name.length > 0,
          feedback: 'Skill name can\'t be empty'
        },
        selectedSkillCategoryId: {
          state: this.selectedSkillCategoryId !== null,
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
      this.errorDetails = []
      const isNewSkill = this.skill.id === null
      const skill = {
        name: this.name,
        description: this.description,
        skillCategoryId: this.selectedSkillCategoryId
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
</style>
