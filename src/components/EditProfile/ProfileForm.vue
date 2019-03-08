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
        :options="employeeRoleList"
        label="title"
        :value="activeEmployeeRole"
        @input="setEmployeeRole"
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
      editedProfile: Object.assign({}, this.profile)
    }
  },
  computed: {
    employeeRoleList () {
      return this.employeeRoles().map(item => {
        return {
          title: item.title,
          id: item.id
        }
      })
    },
    activeEmployeeRole () {
      const activeEmployeeRole = this.employeeRoles().filter(item => {
        return item.id === this.editedProfile.employeeRoleId
      })
      return activeEmployeeRole[0]
    }
  },
  methods: {
    ...mapActions(['updateProfile', 'fetchEmployeeRoles']),
    ...mapGetters(['employeeRoles', 'employeeRoleById']),
    async onSubmit (evt) {
      evt.preventDefault()
      this.errorDetails = []
      this.showError = false
      try {
        await this.updateProfile(this.editedProfile)
        this.redirect()
      } catch (error) {
        this.showError = true
        this.errorDetails = error.details
      }
    },
    onReset (evt) {
      evt.preventDefault()
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.showError = false
      this.errorDetails = []
      this.$nextTick(() => { this.show = true })
      this.redirect()
    },
    redirect () {
      this.$router.push('/profile/' + this.profile.id)
    },
    setEmployeeRole (value) {
      this.editedProfile.employeeRoleId = value.id
    }
  }
}
</script>

<style scoped />
