<template>
  <div class="text-center">
    <b-form
      @submit="onSubmit"
    >
      <b-form-group
        id="first-name-label"
        label="First name *"
        label-cols-sm="3"
        label-for="first-name-input"
        invalid-feedback="Required"
      >
        <b-form-input
          id="first-name-input"
          v-model="editedProfile.firstName"
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
          v-model="editedProfile.lastName"
          type="text"
          :state="inputStates.lastName"
        />
      </b-form-group>
      <b-form-group
        id="role-label"
        label-cols-sm="3"
        label="Role *"
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
        id="birth-year-label"
        label-cols-sm="3"
        label="Year of birth *"
        label-for="birth-year-input"
        :invalid-feedback="birthYearState.filter(item => { return item.state !== undefined ? item.state === false : false }).map(item => item.feedback).join('\n')"
      >
        <b-form-input
          id="birth-year-input"
          v-model="editedProfile.birthYear"
          type="number"
          placeholder="Enter year"
          :state="isBirthYearValid"
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
          v-model="editedProfile.email"
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
          v-model="editedProfile.phone"
          type="tel"
        />
      </b-form-group>
      <b-card>
        <div>
          <h4>
            Information to include in CV
          </h4>
        </div>
        <b-form-group
          v-for="lang in languages"
          :key="'edit-introduction-elem-' + lang.key"
          :label="`Introduction for CV main page (in ${lang.label}) *`"
          :label-for="'introduction-input-' + lang.key"
          label-align-md="left"
          label-size="sm"
          sm="6"
        >
          <b-textarea
            :id="'introduction-input-' + lang.key"
            v-model="editedProfile.introduction[lang.key]"
            :placeholder="`Describe shortly in ${lang.label} your work experience, strengths, interests and motivation`"
            type="text"
            rows="6"
            :state="introductionIsValid(lang.key)"
            @focus="introductionEdited[lang.key] = true"
          />
          <b-form-invalid-feedback
            :id="'introduction-input-feedback-' + lang.key"
            class="text-left"
          >
            <div v-if="editedProfile.introduction[lang.key].length === 0">
              Introduction cannot be empty
            </div>
            <div v-else>
              Maximum number of characters reached ({{ editedProfile.introduction[lang.key].length }}/{{ maxLengths.introduction }})
            </div>
          </b-form-invalid-feedback>
          <div v-if="introductionIsValid(lang.key)">
            <p class="text-right text-success">
              {{ maxLengths.introduction - editedProfile.introduction[lang.key].length }}/{{ maxLengths.introduction }}
            </p>
          </div>
        </b-form-group>
        <b-form-group
          v-for="lang in languages"
          :key="'edit-other-info-elem-' + lang.key"
          :label="`Other info to include in CV (in ${lang.label}) *`"
          :label-for="'other-info-input-' + lang.key"
          label-align-md="left"
          label-size="sm"
          sm="6"
        >
          <b-textarea
            :id="'other-info-input-' + lang.key"
            v-model="editedProfile.otherInfo[lang.key]"
            :placeholder="`Describe your hobbies and interests ${lang.label}`"
            type="text"
            rows="2"
            :state="otherInfoIsValid(lang.key)"
            @focus="otherInfoEdited[lang.key] = true"
          />
          <b-form-invalid-feedback
            :id="'other-info-input-feedback-' + lang.key"
            class="text-left"
          >
            <div v-if="editedProfile.otherInfo[lang.key].length > 0">
              Maximum number of characters reached ({{ editedProfile.otherInfo[lang.key].length }}/{{ maxLengths.otherInfo }})
            </div>
          </b-form-invalid-feedback>
          <div v-if="otherInfoIsValid(lang.key)">
            <p class="text-right text-success">
              {{ maxLengths.otherInfo - editedProfile.otherInfo[lang.key].length }}/{{ maxLengths.otherInfo }}
            </p>
          </div>
        </b-form-group>
      </b-card>
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
        variant="light"
        class="pull-right"
        @click="onCancel"
      >
        Close
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
      maxLengths: {
        introduction: 360,
        otherInfo: 1000
      },
      selectedEmployeeRoles: [],
      editedProfile: JSON.parse(JSON.stringify(this.profile)),
      validated: false,
      introductionEdited: { fi: undefined, en: undefined },
      otherInfoEdited: { fi: undefined, en: undefined }
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
    languages () {
      return [{ key: 'fi', label: 'Finnish' }, { key: 'en', label: 'English' }]
    },
    isBirthYearValid () {
      if (!this.validated) {
        return undefined
      } else {
        return this.birthYearState.every(item => item.state)
      }
    },
    birthYearState () {
      return [
        {
          state: !!this.editedProfile.birthYear,
          feedback: 'Required'
        },
        {
          state: this.editedProfile.birthYear
            ? this.editedProfile.birthYear >= 1930 && this.editedProfile.birthYear < new Date().getFullYear() - 10 : undefined,
          feedback: `Year of birth must be between 1930 and ${new Date().getFullYear() - 10}`
        }
      ]
    },
    inputStates () {
      return {
        firstName: this.validated ? this.editedProfile.firstName.length > 0 : undefined,
        lastName: this.validated ? this.editedProfile.lastName.length > 0 : undefined,
        email: this.validated ? this.editedProfile.lastName.length > 0 : undefined
      }
    },
    formIsValid () {
      const stateArray = []
      for (let entry of Object.entries(this.inputStates)) {
        stateArray.push(entry[1])
      }
      stateArray.push(this.introductionIsValid('fi'))
      stateArray.push(this.introductionIsValid('en'))
      stateArray.push(this.otherInfoIsValid('fi'))
      stateArray.push(this.otherInfoIsValid('en'))
      Array.prototype.push.apply(stateArray, this.birthYearState.map(item => item.state))
      return stateArray.every(item => item)
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
    this.editedProfile.introduction = this.editedProfile.introduction || { fi: '', en: '' }
    this.editedProfile.otherInfo = this.editedProfile.otherInfo || { fi: '', en: '' }
  },
  methods: {
    ...mapActions(['updateProfile']),
    introductionIsValid (key) {
      if (this.introductionEdited[key] || this.validated) {
        return this.editedProfile.introduction[key].length > 0 && this.editedProfile.introduction[key].length <= this.maxLengths.introduction
      }
      return undefined
    },
    otherInfoIsValid (key) {
      if (this.otherInfoEdited[key] || this.validated) {
        return this.editedProfile.otherInfo[key].length <= this.maxLengths.otherInfo
      }
      return undefined
    },
    async onSubmit (evt) {
      evt.preventDefault()
      this.validated = true
      if (this.formIsValid) {
        this.validated = undefined
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
      }
    },
    onCancel () {
      this.$bvModal.hide('editProfileBasicInfoModal')
    }
  }
}
</script>
