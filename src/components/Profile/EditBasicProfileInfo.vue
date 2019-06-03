<template>
  <div class="text-center">
    <b-form
      @submit="onSubmit"
    >
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
        v-for="lang in descriptionLanguages"
        :key="'edit-introduction-elem-' + lang.key"
        sm="6"
      >
        <b-col>
          <small>Introduction for CV main page (in {{ lang.label }})</small>
          <b-textarea
            :id="'input-introduction-' + lang.key"
            v-model="editedProfile.introduction[lang.key]"
            placeholder="Introduction for CV main page"
            type="text"
            rows="6"
            :state="introductionIsValid(lang.key)"
          />
          <b-form-invalid-feedback
            :id="'input-introduction-feedback-' + lang.key"
            class="text-left"
          >
            <div v-if="editedProfile.introduction[lang.key].length === 0">
              Introduction cannot be empty
            </div>
            <div v-else>
              Maximum number of characters reached ({{ editedProfile.introduction[lang.key].length }}/{{ maxIntroductionLength }})
            </div>
          </b-form-invalid-feedback>
          <div v-if="introductionIsValid(lang.key)">
            <p class="text-right text-success">
              {{ maxIntroductionLength - editedProfile.introduction[lang.key].length }}/{{ maxIntroductionLength }}
            </p>
          </div>
        </b-col>
      </b-form-group>
      <b-button
        id="submit-basic-details"
        type="submit"
        variant="primary"
        class="pull-left"
      >
        Save
      </b-button>
      <b-button
        id="reset-basic-details"
        type="button"
        variant="danger"
        class="pull-right"
        @click="onCancel"
      >
        Cancel
      </b-button>
    </b-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import vSelect from 'vue-select'

export default {
  name: 'EditBasicProfileInfo',
  components: { vSelect },
  props: {
    profile: Object
  },
  data () {
    return {
      maxIntroductionLength: 360,
      selectedEmployeeRoles: [],
      editedProfile: JSON.parse(JSON.stringify(this.profile))
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
    descriptionLanguages () {
      return [{ key: 'fi', label: 'Finnish' }, { key: 'en', label: 'English' }]
    }
  },
  watch: {
    selectedEmployeeRoles (newRoles) {
      this.editedProfile.employeeRoles = newRoles.map(role => role.id)
    }
  },
  created () {
    this.editedProfile = JSON.parse(JSON.stringify(this.profile))
    this.selectedEmployeeRoles = this.employeeRoleList.filter(role => {
      return this.editedProfile.employeeRoles.includes(role.id)
    })
    if (!this.profile.introduction) {
      this.editedProfile.introduction = { fi: '', en: '' }
    }
  },
  methods: {
    ...mapActions(['updateProfile']),
    introductionIsValid: function (key) {
      return this.editedProfile.introduction[key].length > 0 && this.editedProfile.introduction[key].length <= this.maxIntroductionLength
    },
    async onSubmit (evt) {
      evt.preventDefault()
      try {
        await this.updateProfile(this.editedProfile)
        this.$emit('profileUpdated')
        this.$toasted.global.rytmi_success({
          message: 'Profile edited.'
        })
        this.$bvModal.hide('editProfileBasicInfoModal')
      } catch (error) {
        this.$toasted.global.rytmi_error({
          message: error
        })
      }
    },
    onCancel () {
      this.$bvModal.hide('editProfileBasicInfoModal')
    }
  }
}
</script>
