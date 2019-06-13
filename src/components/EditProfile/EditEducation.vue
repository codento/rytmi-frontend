<template>
  <div>
    <b-row class="my-2">
      <b-col cols="12">
        <h2>Education</h2>
      </b-col>
      <b-col class="col-12">
        <b-table
          id="education-table"
          :items="tableItems"
          :fields="fields"
          stacked="sm"
        >
          <template
            slot="school"
            slot-scope="data"
          >
            <span class="table-cell-text text-truncate"> {{ data.value }} </span>
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
            <span class="table-cell-text text-truncate"> {{ data.value }} </span>
          </template>

          <template
            slot="major"
            slot-scope="data"
          >
            <span class="table-cell-text text-truncate"> {{ data.value }} </span>
          </template>

          <template
            slot="minor"
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
                @click="openEditModal(data)"
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
          @click="openEditModal()"
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
        @cancel="closeEditModal()"
        @submit="submitEducationForm"
      />
    </b-modal>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import EditEducationForm from './EditEducationForm'

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
  name: 'EditEducation',
  components: {
    EditEducationForm
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
        'actions'
      ],
      editedEducation: this.profile.education ? this.profile.education : [],
      editedEducationItem: cloneDeep(educationTemplate),
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
        this.editedEducationItem = cloneDeep(this.editedEducation[item.index])
        this.editedItemIndex = item.index
      } else {
        this.editedEducationItem = cloneDeep(educationTemplate)
        this.editedItemIndex = -1
      }
      this.$refs['edit-education-modal'].show()
    },
    closeEditModal () {
      this.$refs['edit-education-modal'].hide()
    },
    submitEducationForm (submittedData) {
      if (this.editedItemIndex >= 0) {
        this.editedEducation[this.editedItemIndex] = cloneDeep(submittedData)
      } else {
        this.editedEducation.push(submittedData)
      }
      this.callUpdateProfileAction()
    },
    async callUpdateProfileAction () {
      const editedProfile = cloneDeep(this.profile)
      this.editedEducation.sort((a, b) => b.endYear - a.endYear)
      editedProfile.education = this.editedEducation
      try {
        await this.updateProfile(editedProfile)
        this.$toasted.global.rytmi_success({
          message: 'Profile CV education updated.'
        })
        this.$refs['edit-education-modal'].hide()
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
