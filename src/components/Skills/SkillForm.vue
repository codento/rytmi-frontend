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
      <label>Skill description</label>
      <b-form-input v-model="skill.description" />
      <label>Skill category</label>
      <b-form-select
        v-model="skill.SkillCategoryId"
        :options="getSkillCategoryTitles"
      />
      <b-button
        primary
        type="submit"
      >Submit</b-button>
    </b-form>
    <div
      v-if="showError"
      class="skill-creation-error"
    >
      <ApiErrorDetailsPanel :error-details="errorDetails" />
    </div>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ApiErrorDetailsPanel from '../helpers/ApiErrorDetailsPanel.vue'
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
        SkillCategoryId: null
      }
    }
  },
  computed: {
    ...mapGetters(['skillCategories']),
    getSkillCategoryTitles () {
      const categoryKeys = Object.keys(this.skillCategories)
      return categoryKeys.map(key => {
        return { value: this.skillCategories[key].id, text: this.skillCategories[key].title }
      })
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
          document.getElementById('skills-add-form').reset()
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
