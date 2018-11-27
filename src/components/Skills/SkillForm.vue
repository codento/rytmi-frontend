<template>
  <div>
    <b-form
      id="skills-add-form"
      @submit="onSubmit">
      <h1>Add a new skill</h1>
      <br>
      <label>Skill name</label>
      <b-form-input v-model="skill.name"/>
      <small v-if="getSimilarSkillNames.length > 0">
        Existing skills with a similar name
      </small>
      <ul>
        <li
          v-for="skillName in getSimilarSkillNames"
          :key="skillName">
          {{ skillName }}
        </li>
      </ul>
      <label>Skill description</label>
      <b-form-input v-model="skill.description"/>
      <b-button
        primary
        type="submit">Submit</b-button>
    </b-form>
    <div
      v-if="showError"
      class="skill-creation-error">
      <ApiErrorDetailsPanel :error-details="errorDetails" />
    </div>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
        description: null
      }
    }
  },
  computed: {
    ...mapGetters(['skills']),
    getSimilarSkillNames () {
      if (isEmpty(this.skill.name)) {
        return []
      }
      const skillNames = Object.values(this.skills).map(skill => skill.name)
      return skillNames.filter(skillName => skillName.toLowerCase().includes(this.skill.name.toLowerCase()))
    }
  },
  methods: {
    ...mapActions(['addSkill']),
    onSubmit (evt) {
      evt.preventDefault()
      this.addSkill(this.skill)
        .then(reponse => {
          this.$toasted.global.rytmi_success({
            message: 'New skill added!'
          })
          document.getElementById('skills-add-form').reset()
          if (this.toggleForm !== null) {
            this.toggleForm()
          }
        })
        .catch(err => {
          this.errorDetails = err.response.data.error.details
          this.showError = true
        })
    }
  }
}
</script>
<style scoped>
button {
  width: 50%;
  margin-top: 1em;
}
.skill-creation-error {
  color: red;
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
