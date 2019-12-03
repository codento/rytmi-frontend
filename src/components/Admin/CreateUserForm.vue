<template>
  <div class="text-center mx-3">
    <b-form
      @submit="onSubmit"
    >
      <h5 class="text-left subtitle">
        Create a new user
      </h5>
      <hr>
      <b-form-group
        id="first-name-label"
        label="First name *"
        label-cols-sm="3"
        label-for="first-name-input"
        invalid-feedback="Required"
      >
        <b-form-input
          id="first-name-input"
          v-model="newProfile.firstName"
          type="text"
          :state="inputStates.firstName"
        />
      </b-form-group>
      <b-form-group
        id="last-name-label"
        label-cols-sm="3"
        label="Last name *"
        label-for="last-name-input"
        invalid-feedback="Required"
      >
        <b-form-input
          id="last-name-input"
          v-model="newProfile.lastName"
          type="text"
          :state="inputStates.lastName"
        />
      </b-form-group>
      <b-form-group
        id="role-label"
        label-cols-sm="3"
        label="Role"
        label-for="role-input"
      >
        <v-select
          id="role-input"
          v-model="selectedEmployeeRoles"
          :options="employeeRoleList"
          multiple
        />
      </b-form-group>
      <b-form-group
        id="email-label"
        label-cols-sm="3"
        label="Email *"
        label-for="email-input"
        invalid-feedback="Required"
      >
        <b-form-input
          id="email-input"
          v-model="newProfile.email"
          type="email"
          :state="inputStates.email"
        />
      </b-form-group>
      <b-form-group
        id="phone-number-label"
        label-cols-sm="3"
        label="Phone number"
        label-for="phone-number-input"
        class="mb-6"
      >
        <b-form-input
          id="phone-number-input"
          v-model="newProfile.phone"
          type="tel"
        />
      </b-form-group>
      <hr>
      <div class="my-4">
        <b-button
          id="submit-basic-details"
          type="submit"
          variant="primary"
          class="float-left"
        >
          Save
        </b-button>
        <b-button
          id="reset-basic-details"
          type="button"
          variant="light"
          class="float-right"
          @click="onCancel"
        >
          Close
        </b-button>
      </div>
    </b-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import vSelect from 'vue-select'

export default {
  name: 'CreateProfileForm',
  components: { vSelect },
  data () {
    return {
      selectedEmployeeRoles: [],
      newProfile: {
        firstName: '',
        lastName: '',
        email: ''
      },
      validated: false
    }
  },
  computed: {
    ...mapGetters(['employeeRoles']),
    employeeRoleList () {
      const employeeRolesToArray = Object.keys(this.employeeRoles).map(key => this.employeeRoles[key])
      const roles = employeeRolesToArray.map(item => {
        return {
          label: item.title,
          id: item.id
        }
      })
      return roles.filter(role => !this.selectedEmployeeRoles.some(selectedRole => selectedRole.id === role.id))
    },
    inputStates () {
      return {
        firstName: this.validated ? this.newProfile.firstName.length > 0 : undefined,
        lastName: this.validated ? this.newProfile.lastName.length > 0 : undefined,
        email: this.validated ? this.newProfile.email.length > 0 : undefined
      }
    },
    formIsValid () {
      const stateArray = []
      for (let entry of Object.entries(this.inputStates)) {
        stateArray.push(entry[1])
      }
      return stateArray.every(item => item)
    }
  },
  watch: {
    selectedEmployeeRoles (newRoles) {
      this.newProfile.employeeRoles = newRoles.map(role => role.id)
    }
  },
  methods: {
    ...mapActions(['createUser', 'createProfile']),
    async onSubmit (evt) {
      evt.preventDefault()
      this.validated = true
      if (this.formIsValid) {
        this.validated = undefined
        this.newProfile = {
          ...this.newProfile,
          active: true,
          admin: false
        }
        try {
          const newUser = await this.createUser(this.newProfile)
          this.newProfile.userId = newUser.id
          await this.createProfile(this.newProfile)
          this.$toasted.global.rytmi_success({
            message: 'Profile created.'
          })
          this.$bvModal.hide('create-profile-modal')
        } catch (error) {
          this.$toasted.global.rytmi_error({
            message: error
          })
        }
      }
    },
    onCancel () {
      this.$bvModal.hide('create-profile-modal')
    }
  }
}
</script>

<style scoped>
  .subtitle {
    font-weight: 500;
  }
</style>
