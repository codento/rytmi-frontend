<template>
  <b-form
    @submit="onSubmit"
    @reset="onReset">
    <div v-if="showError">
      <b-alert
        show
        variant="warning">Päivitys epäonnistui</b-alert>
    </div>
    <b-form-group
      id="firstNameLabel"
      horizontal
      label="First name:"
      label-for="firstName">
      <b-form-input
        id="firstNameInput"
        v-model="editedProfile.firstName"
        type="text"
        required
      />
    </b-form-group>
    <b-form-group
      id="lastNameLabel"
      horizontal
      label="Last name:"
      label-for="lastNameInput">
      <b-form-input
        id="lastNameInput"
        v-model="editedProfile.lastName"
        type="text"
        required
      />
    </b-form-group>
    <b-form-group
      id="titleLabel"
      horizontal
      label="Title:"
      label-for="titleInput">
      <b-form-input
        id="titleInput"
        v-model="editedProfile.title"
        type="text"
        placeholder="Enter title"/>
    </b-form-group>
    <b-form-group
      id="emailLabel"
      horizontal
      label="Email:"
      label-for="emailInput">
      <b-form-input
        id="emailInput"
        v-model="editedProfile.email"
        type="email"
        required
      />
    </b-form-group>
    <b-form-group
      id="PhonenumberLabel"
      horizontal
      label="Phone number:"
      label-for="PhonenumberInput">
      <b-form-input
        id="PhonenumberInput"
        v-model="editedProfile.phone"
        type="tel"
        required
      />
    </b-form-group >
    <b-form-group
      id="description"
      horizontal
      label="Description:"
      label-for="descriptionInput">
      <b-form-input
        id="descriptionInput"
        :rows="3"
        v-model="editedProfile.description"
        type="text"
      />
    </b-form-group>
    <b-button
      type="submit"
      variant="primary">Submit</b-button>
    <b-button
      type="reset"
      variant="danger">Reset</b-button>
  </b-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ProfileForm',
  props: {
    'profile': Object
  },
  data () {
    return {
      show: true,
      showError: false,
      editedProfile: Object.assign({}, this.profile)
    }
  },
  methods: {
    ...mapActions([
      'createProfile',
      'updateProfile'
    ]),
    onSubmit (evt) {
      evt.preventDefault()
      this.showError = false
      this.updateProfile(this.editedProfile)
        .then(err => {
          this.error = !this.showError
          console.log(err) // Error: "It broke"
        })
      this.redirect()
    },
    onReset (evt) {
      evt.preventDefault()
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.showError = false
      this.$nextTick(() => { this.show = true })
      this.redirect()
    },
    redirect () {
      this.$router.push('/profile/' + this.$route.params.id)
    }
  }
}
</script>

<style scoped />
