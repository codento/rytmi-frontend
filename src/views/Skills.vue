<template>
  <div>
    <b-form
      id="skills-add-form"
      @submit="onSubmit">

  <h2>Skill name</h2>
      <b-form-input v-model="skill.name"></b-form-input>
      <h2>Skill description</h2>
      <b-form-input v-model="skill.description"></b-form-input>
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
import { mapGetters, mapActions } from "vuex";
import ApiErrorDetailsPanel from "../components/helpers/ApiErrorDetailsPanel.vue";
export default {
  name: "Skills",
  components: {
    ApiErrorDetailsPanel
  },
  data() {
    return {
      showError: false,
      errorDetails: [],
      skill: {
        name: null,
        description: null
      }
    };
  },
  methods: {
    ...mapActions(["addSkill"]),
    onSubmit(evt) {
      evt.preventDefault();
      this.addSkill(this.skill)
        .then(reponse => {
          this.$toasted.global.rytmi_success({
            message: "New skill added!"
          });
          document.getElementById("skills-add-form").reset();
          if (this.toggleForm !== null) {
            this.toggleForm();
          }
        })
        .catch(err => {
          console.log("MyError", err);
          this.errorDetails = err.response.data.error.details;
          this.showError = true;
        });
    }
  }
};
</script>
<style scoped>
button {
  width: 100%;
  margin-top: 1em;
}
.skill-creation-error {
  color: red;
}
</style>
