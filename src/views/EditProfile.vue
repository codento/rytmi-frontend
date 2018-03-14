<template>
  <div class="animated fadeIn">
    <div v-if='showError'>
       <b-alert show variant="warning">Päivitys epäonnistui</b-alert>
    </div>
    <b-form @submit="onSubmit" @reset="onReset"  >
      <b-form-group
          horizontal
          id="firstNameLabel"
          label="Firstname:"
          label-for="firstName">
        <b-form-input 
          id="firstNameInput"
          type="text"
          v-model="profile.firstName"
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
            v-model="profile.lastName"
            required
            placeholder="Enter lastName">
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
            v-model="profile.email"
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
            v-model="profile.phone"
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
            v-model="profile.description"
            placeholder="Short description">
        </b-form-input>
        </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Peruuta</b-button>
    </b-form>
    <edit-skills :profileId="profile.id"/>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import SkillCard from '../components/SkillCard'
import EditSkills from './EditSkills'
export default {
  name: 'EditProfile',
  components: {
    SkillCard,
    EditSkills
  },
  computed: {
    ...mapGetters([
      'profile'
    ])
  },
  methods: {
    ...mapActions([
      'updateProfile'
    ]),
    onSubmit (evt) {
      evt.preventDefault()
      this.showError = false
      this.updateProfile(this.profile).then(err => {
        this.error = !this.showError
        console.log(err) // Error: "It broke"
      })
    },
    onReset (evt) {
      evt.preventDefault()
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.showError = false
      this.$nextTick(() => { this.show = true })
    }
  },
  data () {
    return {
      show: true,
      showError: false
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>
