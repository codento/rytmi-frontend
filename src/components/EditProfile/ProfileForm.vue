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
      id="titleLabel"
      label-cols-sm="3"
      label="Title:"
      label-for="titleInput"
    >
      <b-form-input
        id="titleInput"
        v-model="editedProfile.title"
        type="text"
        placeholder="Enter title"
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
        required
      />
    </b-form-group>
    <b-form-group
      id="description"
      label-cols-sm="3"
      label="Description:"
      label-for="descriptionInput"
    >
      <b-form-input
        id="descriptionInput"
        v-model="editedProfile.description"
        :rows="3"
        type="text"
      />
    </b-form-group>
    <b-button
      type="submit"
      variant="primary"
    >
      Submit
    </b-button>
    <b-button
      type="reset"
      variant="danger"
    >
      Reset
    </b-button>
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import vSelect from 'vue-select'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel'

export default {
  name: 'ProfileForm',
  components: { ApiErrorDetailsPanel, vSelect },
  props: {
    'profile': Object
  },
  data () {
    return {
      show: true,
      showError: false,
      errorDetails: [],
      editedProfile: Object.assign({}, this.profile),
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
        this.redirect()
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

<style scoped />
