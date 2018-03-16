<template>
  <b-form @submit="onSubmit" @reset="onReset">
    <div v-if='showError'>
      <b-alert show variant="warning">Päivitys epäonnistui</b-alert>
    </div>
    <b-form-group
      horizontal
      id="firstNameLabel"
      label="Firstname:"
      label-for="firstName">
      <b-form-input
        id="firstNameInput"
        type="text"
        v-model="editedProfile.firstName"
        required
        placeholder="Enter firstName">
      </b-form-input>
    </b-form-group>
    <b-form-group
      horizontal
      id="lastNameLabel"
      label="Lastname:"
      label-for="lastNameInput">
      <b-form-input
        id="lastNameInput"
        type="text"
        v-model="editedProfile.lastName"
        required
        placeholder="Enter lastName">
      </b-form-input>
    </b-form-group>
    <b-form-group
      horizontal
      id="titleLabel"
      label="Title:"
      label-for="titleInput">
      <b-form-input
        id="titleInput"
        type="text"
        v-model="editedProfile.title"
        placeholder="Enter title">
      </b-form-input>
    </b-form-group>
    <b-form-group
      horizontal
      id="emailLabel"
      label="Email:"
      label-for="emailInput">
      <b-form-input
        id="emailInput"
        type="email"
        v-model="editedProfile.email"
        required
        placeholder="Enter Email">
      </b-form-input>
    </b-form-group>
    <b-form-group
      id="PhonenumberLabel"
      horizontal
      label="Phonenumber:"
      label-for="PhonenumberInput">
      <b-form-input
        id="PhonenumberInput"
        type='tel'
        v-model="editedProfile.phone"
        required
        placeholder="Enter Phonenumber">
      </b-form-input>
    </b-form-group >
    <b-form-group
      id="description"
      horizontal
      label="Description:"
      label-for="descriptionInput">
      <b-form-input
        id="descriptionInput"
        :rows="3"
        type="text"
        v-model="editedProfile.description"
        placeholder="Short description">
      </b-form-input>
    </b-form-group>
    <b-form-group
      id="birthday"
      horizontal
      label="Birthday:"
      label-for="birthdayInput">
      <b-form-input
        id="birthdayInput"
        type="date"
        v-model="editedProfile.birthday">
      </b-form-input>
    </b-form-group>
    <!--<b-form-group
      id="photoPath"
      horizontal
      label="Profile picture url:"
      label-for="photoPathInput">
      <b-form-input
        id="photoPathInput"
        type="text"
        v-model="editedProfile.photoPath">
      </b-form-input>
    </b-form-group>-->
    <b-button type="submit" variant="primary">Submit</b-button>
    <b-button type="reset" variant="danger">Peruuta</b-button>
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
      showError: false
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
<<<<<<< HEAD
<<<<<<< HEAD
  },
  data () {
    return {
      show: true,
      showError: false,
      editedProfile: Object.assign({}, this.profile)
    }
=======
>>>>>>> Styling improvements
=======
>>>>>>> styling_improvements
  }
}
</script>

<style scoped />
