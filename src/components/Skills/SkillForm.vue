<template>
  <div>
    <b-form
      id="skills-add-form"
      @submit="onSubmit"
    >
      <h1>Add a new skill</h1>
      <br>
      <label>Skill name</label>
      <b-form-input v-model="skill.name" />
      <small v-if="getSimilarSkillNames.length > 0">
        Existing skills with a similar name
      </small>
      <ul>
        <li
          v-for="skillName in getSimilarSkillNames"
          :key="skillName"
        >
          {{ skillName }}
        </li>
      </ul>
      <label>Skill description</label>
      <b-form-input v-model="skill.description" />
      <label>Skill category</label>
      <b-form-select
        v-model="skill.skillCategoryId"
        :options="getSkillCategoryTitles"
      />
      <b-button
        primary
        type="submit"
      >
        Submit
      </b-button>
    </b-form>
    <div
      v-if="showError"
      class="text-danger"
    >
      <ApiErrorDetailsPanel :error-details="errorDetails" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ApiErrorDetailsPanel from '../helpers/ApiErrorDetailsPanel.vue'
import { isEmpty } from 'lodash'

export default {
  name: 'SkillsForm',
  components: {
    ApiErrorDetailsPanel
  },
  data () {
    return {
      showError: false,
      errorDetails: [],
      skill: {
        name: null,
        description: null,
        skillCategoryId: null
      }
    }
  },
  computed: {
    ...mapGetters(['skillCategories', 'skills']),
    getSkillCategoryTitles () {
      const categoryKeys = Object.keys(this.skillCategories)
      return categoryKeys.map(key => {
        return { value: this.skillCategories[key].id, text: this.skillCategories[key].title }
      })
    },
    getSimilarSkillNames () {
      if (isEmpty(this.skill.name)) {
        return []
      }
      const skillNames = Object.values(this.skills).map(skill => skill.name)
      const matchingSkillNames = skillNames.filter(skillName => skillName.toLowerCase().includes(this.skill.name.toLowerCase()))
      matchingSkillNames.sort()
      return matchingSkillNames
    }
  },
  methods: {
    ...mapActions(['addSkill', 'getSkillCategories']),
    onSubmit (evt) {
      evt.preventDefault()
      this.addSkill(this.skill)
        .then(response => {
          this.$toasted.global.rytmi_success({
            message: 'New skill added!'
          })
          this.resetForm()
        })
        .catch(err => {
          if (Array.isArray(err.response.data.error.details)) {
            this.errorDetails = err.response.data.error.details
          } else {
            this.errorDetails.push(err.response.data.error.details)
          }
          this.showError = true
        })
    },
    resetForm () {
      this.showError = false
      this.errorDetails = []
      this.skill = { name: null, description: null, skillCategoryId: null }
    }
  }
}
</script>
<style scoped>
button {
  width: 50%;
  margin-top: 1em;
}

form{
 width: 50%;
 padding-top: 1%;
 padding-bottom: 1%;
 padding-left: 1%;
 padding-right: 1%;
 background-color:#f0f3f5;
}
</style>
