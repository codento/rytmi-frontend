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
        />
        <small v-if="similarSkillNames.length > 0">
          Existing skills with a similar name
        </small>
        <b-list-group>
          <b-list-group-item
            v-for="skillName in similarSkillNames"
            :key="skillName"
          >
            {{ skillName }}
          </b-list-group-item>
        </b-list-group>
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
      <b-col
        md="2"
        cols="3"
      >
        <b-button
          id="save-edits"
          type="submit"
          variant="success"
          :disabled="!Object.values(inputState).every(item => item.state)"
          @click.prevent="submitSkill()"
        >
          Submit
        </b-button>
      </b-col>
      <b-col
        md="2"
        cols="3"
      >
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
      name: this.skill.name ? this.skill.name : '',
      description: this.skill.description ? this.skill.description : '',
      selectedSkillCategoryId: this.skill.skillCategoryId ? this.skill.skillCategoryId : null,
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
      }).sort((a, b) => a.title - b.title)
    },
    similarSkillNames () {
      if (isEmpty(this.name)) {
        return []
      }
      const skillNames = Object.values(this.skills).map(skill => skill.name)
      const matchingSkillNames = skillNames.filter(skillName => skillName.toLowerCase().includes(this.name.toLowerCase()))
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
