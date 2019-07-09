<template>
  <div>
    <b-row class="my-2">
      <b-col cols="12">
        <h2>Education</h2>
      </b-col>
      <b-col class="col-12">
        <b-table
          id="education-table"
          :items="educationTableItems"
          :fields="educationFields"
          stacked="sm"
        >
          <template
            slot="school"
            slot-scope="data"
          >
            <span class="table-cell-text text-truncate"> {{ data.value }} </span>
          </template>

          <template
            slot="degree"
            slot-scope="data"
          >
            <span class="table-cell-text text-truncate"> {{ data.value }} </span>
          </template>

          <template
            slot="actions"
            slot-scope="data"
          >
            <b-button-group>
              <b-btn
                :id="'edit-education-item-btn-' + data.index"
                size="sm"
                class="mr-1 table-button"
                variant="primary"
                @click="openEducationEditModal(data)"
              >
                Edit
              </b-btn>
              <b-btn
                :id="'remove-education-item-btn-' + data.index"
                name="remove"
                size="sm"
                class="mr-1 table-button"
                variant="danger"
                @click.stop="removeEducation(data)"
              >
                Remove
              </b-btn>
            </b-button-group>
          </template>
        </b-table>
      </b-col>
      <b-col cols="12">
        <b-button
          id="add-education-btn"
          size="sm"
          class="mr-1"
          variant="primary"
          @click="openEducationEditModal()"
        >
          Add new education
        </b-button>
      </b-col>
    </b-row>
    <b-modal
      ref="edit-education-modal"
      title=""
      size="lg"
      hide-footer
      hide-header
    >
      <EditEducationForm
        :initial-values="editedEducationItem"
        @cancel="closeEducationEditModal()"
        @submit="submitEducationForm"
      />
    </b-modal>

    <b-row class="pt-3">
      <b-col cols="12">
        <h2>Certificates</h2>
      </b-col>
      <b-col class="col-12">
        <b-table
          id="certificate-table"
          :items="certificateTableItems"
          :fields="certificateFields"
          stacked="sm"
          class="certificate-table"
        >
          <template
            slot="name"
            slot-scope="data"
          >
            <span class="table-cell-text text-truncate"> {{ data.value }} </span>
          </template>

          <template
            slot="description"
            slot-scope="data"
          >
            <span class="table-cell-text text-truncate"> {{ data.value }} </span>
          </template>

          <template
            slot="actions"
            slot-scope="data"
          >
            <b-button-group>
              <b-btn
                :id="'edit-certificate-item-btn-' + data.index"
                size="sm"
                class="mr-1 table-button"
                variant="primary"
                @click="openCertificateEditModal(data)"
              >
                Edit
              </b-btn>
              <b-btn
                :id="'remove-certificate-item-btn-' + data.index"
                name="remove"
                size="sm"
                class="mr-1 table-button"
                variant="danger"
                @click.stop="removeCertificate(data)"
              >
                Remove
              </b-btn>
            </b-button-group>
          </template>
        </b-table>
      </b-col>
      <b-col cols="12">
        <b-button
          id="add-certificate-btn"
          size="sm"
          class="mr-1"
          variant="primary"
          @click="openCertificateEditModal()"
        >
          Add a new certificate
        </b-button>
      </b-col>
    </b-row>
    <b-modal
      ref="edit-certificate-modal"
      title=""
      size="lg"
      hide-footer
      hide-header
    >
      <EditCertificateForm
        :certificate="editedCertificateItem"
        @cancel="closeCertificateEditModal()"
        @submit="submitCertificateForm"
      />
    </b-modal>
  </div>
</template>

<script>
import { cloneDeep, orderBy } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import EditEducationForm from './EditEducationForm'
import EditCertificateForm from './EditCertificateForm'

const educationTemplate = {
  fi: {
    school: '',
    degree: '',
    major: '',
    minor: '',
    additionalInfo: ''
  },
  en: {
    school: '',
    degree: '',
    major: '',
    minor: '',
    additionalInfo: ''
  },
  startYear: null,
  endYear: null
}

const certificateTemplate = {
  fi: {
    name: '',
    description: ''
  },
  en: {
    name: '',
    description: ''
  },
  year: null
}

export default {
  name: 'EditEducation',
  components: {
    EditEducationForm,
    EditCertificateForm
  },
  props: {
    profile: Object
  },
  data () {
    return {
      educationFields: [
        { key: 'school', label: 'Place of education' },
        { key: 'startYear', label: 'Starting year' },
        { key: 'endYear', label: 'Finishing year' },
        { key: 'degree', label: 'Degree' },
        'actions'
      ],
      editedEducation: this.profile.education ? this.profile.education : [],
      editedEducationItem: cloneDeep(educationTemplate),
      editedEducationItemIndex: -1,
      certificateFields: [
        { key: 'name', label: 'Certificate\'s name' },
        { key: 'description', label: 'Description' },
        { key: 'year', label: 'Year' },
        'actions'
      ],
      editedCertificates: this.profile.expertiseValidations ? this.profile.expertiseValidations : [],
      editedCertificateItem: cloneDeep(certificateTemplate),
      editedCertificateItemIndex: -1
    }
  },
  computed: {
    ...mapGetters(['currentLanguage']),
    educationTableItems () {
      return this.editedEducation.map(item => {
        return {
          school: item[this.currentLanguage].school,
          degree: item[this.currentLanguage].degree,
          startYear: item.startYear,
          endYear: item.endYear,
          major: item[this.currentLanguage].major,
          minor: item[this.currentLanguage].minor,
          additionalInfo: item[this.currentLanguage].additionalInfo
        }
      })
    },
    certificateTableItems () {
      return this.editedCertificates.map(item => {
        return {
          name: item[this.currentLanguage].name,
          description: item[this.currentLanguage].description,
          year: item.year
        }
      })
    }
  },
  methods: {
    ...mapActions(['updateProfile']),
    removeEducation (item) {
      const confirmation = confirm(`Are you sure you want to remove this education? (${item.item.degree})`)
      if (confirmation) {
        this.editedEducation.splice(item.index, 1)
        this.callUpdateProfileAction()
      }
    },
    removeCertificate (item) {
      const confirmation = confirm(`Are you sure you want to remove this certificate? (${item.item.name})`)
      if (confirmation) {
        this.editedCertificates.splice(item.index, 1)
        this.callUpdateProfileAction()
      }
    },
    openEducationEditModal (item = null) {
      if (item) {
        this.editedEducationItem = cloneDeep(this.editedEducation[item.index])
        this.editedEducationItemIndex = item.index
      } else {
        this.editedEducationItem = cloneDeep(educationTemplate)
        this.editedEducationItemIndex = -1
      }
      this.$refs['edit-education-modal'].show()
    },
    openCertificateEditModal (item = null) {
      if (item) {
        this.editedCertificateItem = cloneDeep(this.editedCertificates[item.index])
        this.editedCertificateItemIndex = item.index
      } else {
        this.editedCertificateItem = cloneDeep(certificateTemplate)
        this.editedCertificateItemIndex = -1
      }
      this.$refs['edit-certificate-modal'].show()
    },
    closeEducationEditModal () {
      this.$refs['edit-education-modal'].hide()
    },
    closeCertificateEditModal () {
      this.$refs['edit-certificate-modal'].hide()
    },
    submitEducationForm (submittedData) {
      if (this.editedEducationItemIndex >= 0) {
        this.editedEducation[this.editedEducationItemIndex] = cloneDeep(submittedData)
      } else {
        this.editedEducation.push(submittedData)
      }
      this.closeEducationEditModal()
      this.callUpdateProfileAction()
    },
    submitCertificateForm (submittedData) {
      if (this.editedCertificateItemIndex >= 0) {
        this.editedCertificates[this.editedCertificateItemIndex] = cloneDeep(submittedData)
      } else {
        this.editedCertificates.push(submittedData)
      }
      this.closeCertificateEditModal()
      this.callUpdateProfileAction()
    },
    async callUpdateProfileAction () {
      const editedProfile = cloneDeep(this.profile)
      this.editedEducation = orderBy(this.editedEducation, ['endYear'], ['desc'])
      this.editedCertificates = orderBy(this.editedCertificates, ['year', 'name'], ['desc', 'asc'])
      editedProfile.education = this.editedEducation
      editedProfile.expertiseValidations = this.editedCertificates
      try {
        await this.updateProfile(editedProfile)
        this.$toasted.global.rytmi_success({
          message: 'Profile updated.'
        })
      } catch (error) {
        this.$toasted.global.rytmi_error({
          message: error
        })
      }
    }
  }
}
</script>

<style scoped >
button.table-button {
  width: 100%;
}
.table-cell-text {
  width: 0;
  min-width: 100%;
  display: inline-block;
  max-width: 150px;
}
.modal-btn {
  margin-top: 0.5rem;
}
</style>
