<template>
  <div>
    <b-row class="my-2">
      <b-col cols="12">
        <h2>Education</h2>
      </b-col>
      <b-col class="col-12 education-table">
        <b-table
          :items="tableItems"
          :fields="fields"
          fixed
          caption-top
          stacked="sm"
        >
          <template
            slot="school"
            slot-scope="data"
          >
            {{ data.value }}
          </template>

          <template
            slot="startYear"
            slot-scope="data"
          >
            {{ data.value }}
          </template>

          <template
            slot="endYear"
            slot-scope="data"
          >
            {{ data.value }}
          </template>

          <template
            slot="degree"
            slot-scope="data"
          >
            {{ data.value }}
          </template>

          <template
            slot="major"
            slot-scope="data"
          >
            {{ data.value }}
          </template>

          <template
            slot="minor"
            slot-scope="data"
          >
            {{ data.value }}
          </template>

          <template
            slot="edit"
            slot-scope="data"
          >
            <b-btn
              size="sm"
              class="mr-1 table-button"
              variant="success"
              @click="openEditModal(data)"
            >
              Edit
            </b-btn>
          </template>
          <template
            slot="remove"
            slot-scope="data"
          >
            <b-btn
              name="remove"
              size="sm"
              class="mr-1 table-button"
              variant="danger"
              @click.stop="removeEducation(data)"
            >
              Remove
            </b-btn>
          </template>
        </b-table>
      </b-col>
      <b-col cols="12">
        <b-button
          size="sm"
          class="mr-1"
          variant="success"
          @click="openEditModal()"
        >
          Add
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
      <h3>Edit education data</h3>
      <CvInfoEditEducationForm
        :initial-values="editedEducationItem"
        :labels="fields.filter(item => item.label)"
        @cancel="closeEditModal()"
        @submit="submitEducationForm"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CvInfoEditEducationForm from './CvInfoEditEducationForm'

const educationTemplate = {
  fi: {
    school: '',
    degree: '',
    major: '',
    minor: ''
  },
  en: {
    school: '',
    degree: '',
    major: '',
    minor: ''
  },
  startYear: null,
  endYear: null
}

export default {
  name: 'CvInfoEditEducation',
  components: {
    CvInfoEditEducationForm
  },
  props: {
    profile: Object
  },
  data () {
    return {
      fields: [
        { key: 'school', label: 'Place of education' },
        { key: 'startYear', label: 'Starting year' },
        { key: 'endYear', label: 'Finishing year' },
        { key: 'degree', label: 'Degree' },
        { key: 'major', label: 'Major' },
        { key: 'minor', label: 'Minor' },
        'edit',
        'remove'
      ],
      editedEducation: this.profile.education ? this.profile.education : [],
      editedEducationItem: Object.assign({}, educationTemplate),
      editedItemIndex: -1
    }
  },
  computed: {
    ...mapGetters(['currentLanguage']),
    tableItems () {
      return this.editedEducation.map(item => {
        return {
          school: item[this.currentLanguage].school,
          degree: item[this.currentLanguage].degree,
          startYear: item.startYear,
          endYear: item.endYear,
          major: item[this.currentLanguage].major,
          minor: item[this.currentLanguage].minor
        }
      })
    }
  },
  methods: {
    ...mapActions(['updateProfile']),
    removeEducation (item) {
      const confirmation = confirm('Are you sure?')
      if (confirmation) {
        this.editedEducation.splice(item.index, 1)
        this.callUpdateProfileAction()
      }
    },
    openEditModal (item = null) {
      if (item) {
        this.editedEducationItem = Object.assign({}, this.editedEducation[item.index])
        this.editedItemIndex = item.index
      } else {
        this.editedEducationItem = Object.assign({}, educationTemplate)
        this.editedItemIndex = -1
      }
      this.$refs['edit-education-modal'].show()
    },
    closeEditModal () {
      this.$refs['edit-education-modal'].hide()
    },
    submitEducationForm (submittedData) {
      if (this.editedItemIndex >= 0) {
        this.editedEducation[this.editedItemIndex] = Object.assign({},submittedData)
      } else {
        this.editedEducation.push(submittedData)
      }
      this.callUpdateProfileAction()
    },
    callUpdateProfileAction () {
      const editedProfile = Object.assign({}, this.profile)
      this.editedEducation.sort((a, b) => b.endYear - a.endYear)
      editedProfile.education = this.editedEducation
      this.updateProfile(editedProfile)
        .then((response) => {
          this.$toasted.global.rytmi_success({
            message: 'Profile CV information updated.'
          })
          this.editedEducationItem.data = Object.assign({}, educationTemplate)
          this.$refs['edit-education-modal'].hide()
        })
        .catch((err) => {
          this.$toasted.global.rytmi_error({
            message: err
          })
        })
    }
  }
}
</script>

<style scoped >
button.table-button {
  width: 100%;
}
.modal-btn {
  margin-top: 0.5rem;
}

</style>
