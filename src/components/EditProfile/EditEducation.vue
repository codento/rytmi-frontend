<template>
  <div>
    <b-row class="py-4">
      <b-col cols="12">
        <h2>Education</h2>
      </b-col>
      <b-col class="col-12">
        <b-table
          id="education-table"
          :items="educationTableItems"
          :fields="educationFields"
          hover
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
            slot="edit"
            slot-scope="data"
          >
            <Edit2Icon
              :id="'edit-education-item-' + data.index"
              class="clickable-icon"
              @click.prevent="openEducationEditModal(data)"
            />
          </template>

          <template
            slot="remove"
            slot-scope="data"
          >
            <Trash2Icon
              :id="'remove-education-item-' + data.index"
              class="clickable-icon"
              @click.stop="removeEducation(data)"
            />
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
    <b-row class="py-4">
      <b-col cols="12">
        <h2>Certificates and other validations of expertise</h2>
      </b-col>
      <b-col class="col-12">
        <b-table
          id="certificate-or-other-table"
          :items="certificateOrOtherTableItems"
          :fields="certificateOrOtherFields"
          stacked="sm"
          class="certificate-or-other-table"
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
            slot="edit"
            slot-scope="data"
          >
            <Edit2Icon
              :id="'edit-certificate-or-other-item-' + data.index"
              class="clickable-icon"
              @click.prevent="openCertificateOrOtherEditModal(data)"
            />
          </template>

          <template
            slot="remove"
            slot-scope="data"
          >
            <Trash2Icon
              :id="'remove-certificate-or-other-item-' + data.index"
              class="clickable-icon"
              @click.stop="removeCertificateOrOther(data)"
            />
          </template>
        </b-table>
      </b-col>
      <b-col cols="12">
        <b-button
          id="add-certificate-or-other-btn"
          size="sm"
          class="mr-1"
          variant="primary"
          @click="openCertificateOrOtherEditModal()"
        >
          Add a new certificate or other similar item
        </b-button>
      </b-col>
    </b-row>
    <b-modal
      ref="edit-certificate-or-other-modal"
      title=""
      size="lg"
      hide-footer
      hide-header
    >
      <EditCertificateOrOtherForm
        :certificate-or-other="editedCertificateOrOtherItem"
        @cancel="closeCertificateOrOtherEditModal()"
        @submit="submitCertificateOrOtherForm"
      />
    </b-modal>
  </div>
</template>

<script>
import { cloneDeep, orderBy } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { Edit2Icon, Trash2Icon } from 'vue-feather-icons'
import EditEducationForm from './EditEducationForm'
import EditCertificateOrOtherForm from './EditCertificateOrOtherForm'

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

const certificateOrOtherTemplate = {
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
    EditCertificateOrOtherForm,
    Edit2Icon,
    Trash2Icon
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
        { key: 'edit', label: '' },
        { key: 'remove', label: '' }
      ],
      editedEducation: this.profile.education ? this.profile.education : [],
      editedEducationItem: cloneDeep(educationTemplate),
      editedEducationItemIndex: -1,
      certificateOrOtherFields: [
        { key: 'name', label: 'Certificate\'s or other similar item\'s name' },
        { key: 'description', label: 'Description' },
        { key: 'year', label: 'Year' },
        { key: 'edit', label: '' },
        { key: 'remove', label: '' }
      ],
      editedCertificatesAndOthers: this.profile.certificatesAndOthers ? this.profile.certificatesAndOthers : [],
      editedCertificateOrOtherItem: cloneDeep(certificateOrOtherTemplate),
      editedCertificateOrOtherItemIndex: -1
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
    certificateOrOtherTableItems () {
      return this.editedCertificatesAndOthers.map(item => {
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
    removeCertificateOrOther (item) {
      const confirmation = confirm(`Are you sure you want to remove this certificate or similar item? (${item.item.name})`)
      if (confirmation) {
        this.editedCertificatesAndOthers.splice(item.index, 1)
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
    openCertificateOrOtherEditModal (item = null) {
      if (item) {
        this.editedCertificateOrOtherItem = cloneDeep(this.editedCertificatesAndOthers[item.index])
        this.editedCertificateOrOtherItemIndex = item.index
      } else {
        this.editedCertificateOrOtherItem = cloneDeep(certificateOrOtherTemplate)
        this.editedCertificateOrOtherItemIndex = -1
      }
      this.$refs['edit-certificate-or-other-modal'].show()
    },
    closeEducationEditModal () {
      this.$refs['edit-education-modal'].hide()
    },
    closeCertificateOrOtherEditModal () {
      this.$refs['edit-certificate-or-other-modal'].hide()
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
    submitCertificateOrOtherForm (submittedData) {
      if (this.editedCertificateOrOtherItemIndex >= 0) {
        this.editedCertificatesAndOthers[this.editedCertificateOrOtherItemIndex] = cloneDeep(submittedData)
      } else {
        this.editedCertificatesAndOthers.push(submittedData)
      }
      this.closeCertificateOrOtherEditModal()
      this.callUpdateProfileAction()
    },
    async callUpdateProfileAction () {
      const editedProfile = cloneDeep(this.profile)
      this.editedEducation = orderBy(this.editedEducation, ['endYear'], ['desc'])
      this.editedCertificatesAndOthers = orderBy(this.editedCertificatesAndOthers, ['year', 'name'], ['desc', 'asc'])
      editedProfile.education = this.editedEducation
      editedProfile.certificatesAndOthers = this.editedCertificatesAndOthers
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

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.clickable-icon {
  cursor: pointer;
  color: darken($color: $c-light, $amount: 40);
}
.clickable-icon:hover {
  color: darken($color: $c-light, $amount: 80);
}
.table-cell-text {
  width: 0;
  min-width: 100%;
  display: inline-block;
  max-width: 150px;
}
</style>
