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
    <b-form-group
      id="description"
      label-cols-sm="3"
      label="Description:"
    >
      <b-row>
        <b-col sm="6">
          <small>Introduction for CV main page (in Finnish)</small>
          <b-textarea
            v-model="getDescription('fi','introduction').description"
            placeholder="Introduction for CV main page (fi)"
            type="text"
            rows="5"
          />
        </b-col>
        <b-col sm="6">
          <small>Introduction for CV main page (in English)</small>
          <b-textarea
            v-model="getDescription('en','introduction').description"
            placeholder="Introduction for CV main page (en)"
            type="text"
            rows="5"
          />
        </b-col>
      </b-row>
      <EditOtherInfo
        :input-text="getDescription('fi','other').description"
        input-label="Other info for CV (in Finnish)"
        language-key="fi"
        :rows="5"
        @input-updated="updateOtherInfo"
      />
      <EditOtherInfo
        :input-text="getDescription('en','other').description"
        input-label="Other info for CV (in English)"
        language-key="en"
        :rows="5"
        @input-updated="updateOtherInfo"
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
import { mapActions, mapGetters } from 'vuex'
import vSelect from 'vue-select'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel'
import { EditOtherInfo } from '@/components/Common'

export default {
  name: 'ProfileForm',
  components: { ApiErrorDetailsPanel, vSelect, EditOtherInfo },
  props: {
    profile: Object
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
    },
    profile (newProfileValue) {
      this.editedProfile = Object.assign({}, newProfileValue)
    }
  },
  created () {
    this.selectedEmployeeRoles = this.employeeRoleList.filter(role => {
      return this.editedProfile.employeeRoles.includes(role.id)
    })
  },
  methods: {
    ...mapActions(['updateProfile']),
    getDescription (language, type) {
      const description = this.profile.cvDescriptions
        .find(description => description.language === language && description.type === type)
      if (!description) {
        this.profile.cvDescriptions.push(
          {
            description: '',
            language: language,
            type: type
          }
        )
      }
      return this.profile.cvDescriptions
        .find(description => description.language === language && description.type === type)
    },
    updateOtherInfo: function (updatedInfo, language) {
      this.getDescription(language, 'other').description = updatedInfo
    },
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
