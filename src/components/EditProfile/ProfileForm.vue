<template>
  <b-form
    @submit="onSubmit"
    @reset="onReset"
  >
    <div v-if="showError">
      <b-alert
        show
        variant="warning"
      >
        Update failed
        <ApiErrorDetailsPanel :error-details="errorDetails" />
      </b-alert>
    </div>
    <b-form-group
      id="firstNameLabel"
      label="First name:"
      label-cols-sm="3"
      label-for="firstName"
    >
      <b-form-input
        id="firstNameInput"
        v-model="editedProfile.firstName"
        type="text"
        required
      />
    </b-form-group>
    <b-form-group
      id="lastNameLabel"
      label-cols-sm="3"
      label="Last name:"
      label-for="lastNameInput"
    >
      <b-form-input
        id="lastNameInput"
        v-model="editedProfile.lastName"
        type="text"
        required
      />
    </b-form-group>
    <b-form-group
      id="roleLabel"
      label-cols-sm="3"
      label="Role:"
      label-for="roleInput"
    >
      <v-select
        id="roleInput"
        v-model="selectedEmployeeRoles"
        :options="employeeRoleList"
        multiple
      />
    </b-form-group>
    <b-form-group
      id="birthYearLabel"
      label-cols-sm="3"
      label="Birth year:"
      label-for="birthYearInput"
    >
      <b-form-input
        id="birthYearInput"
        v-model="editedProfile.birthYear"
        type="number"
        placeholder="Enter year"
      />
    </b-form-group>
    <b-form-group
      id="emailLabel"
      label-cols-sm="3"
      label="Email:"
      label-for="emailInput"
    >
      <b-form-input
        id="emailInput"
        v-model="editedProfile.email"
        type="email"
        required
      />
    </b-form-group>
    <b-form-group
      id="PhonenumberLabel"
      label-cols-sm="3"
      label="Phone number:"
      label-for="PhonenumberInput"
    >
      <b-form-input
        id="PhonenumberInput"
        v-model="editedProfile.phone"
        type="tel"
      />
    </b-form-group>
    <b-button
      id="submit-basic-details"
      type="submit"
      variant="primary"
    >
      Submit
    </b-button>
    <b-button
      id="reset-basic-details"
      type="reset"
      variant="danger"
    >
      Reset
    </b-button>
  </b-form>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import vSelect from 'vue-select'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel'

export default {
  name: 'ProfileForm',
  components: { ApiErrorDetailsPanel, vSelect },
  props: {
    profile: Object
  },
  data () {
    return {
      show: true,
      showError: false,
      errorDetails: [],
      editedProfile: cloneDeep(this.profile),
      selectedEmployeeRoles: []
    }
  },
  computed: {
    ...mapGetters(['employeeRoles', 'employeeRoleById']),
    employeeRoleList () {
      const employeeRolesToArray = Object.keys(this.employeeRoles).map(key => this.employeeRoles[key])
      const roles = employeeRolesToArray.map(item => {
        return {
          label: item.title,
          id: item.id
        }
      })
      return roles.filter(role => !this.selectedEmployeeRoles.some(selectedRole => selectedRole.id === role.id))
    }
  },
  watch: {
    selectedEmployeeRoles (newRoles) {
      this.editedProfile.employeeRoles = newRoles.map(role => role.id)
    },
    profile (newProfileValue) {
      this.editedProfile = cloneDeep(newProfileValue)
    }
  },
  created () {
    this.selectedEmployeeRoles = this.employeeRoleList.filter(role => {
      return this.editedProfile.employeeRoles.includes(role.id)
    })
  },
  methods: {
    ...mapActions(['updateProfile']),
    async onSubmit (evt) {
      evt.preventDefault()
      this.errorDetails = []
      this.showError = false
      try {
        await this.updateProfile(this.editedProfile)
        this.$emit('profileUpdated')
        this.$toasted.global.rytmi_success({
          message: 'Profile edited.'
        })
        this.$router.push(`/profile/${this.profile.id}`)
      } catch (error) {
        this.showError = true
        if (Array.isArray(error.details)) {
          this.errorDetails = error.details
        } else {
          this.errorDetails.push(error.details)
        }
      }
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
      this.$router.push('/profile/' + this.profile.id)
    }
  }
}
</script>
