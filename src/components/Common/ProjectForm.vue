<template>
  <b-form
    :id="formId"
    class="animated fadeIn"
  >
    <b-row v-if="isInternalCompanyProject">
      <b-col>
        <small for="project-code-input">Project code *</small>
        <b-form-group
          :invalid-feedback="projectCodeState.filter(item => { return item.state !== undefined ? item.state === false : false }).map(item => item.feedback).join('\n')"
        >
          <b-form-input
            id="project-code-input"
            v-model="editedProject.code"
            placeholder="Project code"
            required
            type="number"
            min="0"
            max="99999"
            :state="isProjectCodeValid"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <small for="project-name-fi-input">Project name (in Finnish) *</small>
        <b-form-group
          invalid-feedback="Required"
        >
          <b-form-input
            id="project-name-fi-input"
            v-model="editedProject.name.fi"
            placeholder="Project name (fi)"
            required
            type="text"
            :state="inputStates.projectNameFi"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <small for="project-name-en-input">Project name (in English) *</small>
        <b-form-group
          invalid-feedback="Required"
        >
          <b-form-input
            id="project-name-en-input"
            v-model="editedProject.name.en"
            placeholder="Project name (en)"
            required
            type="text"
            :state="inputStates.projectNameEn"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <small>Start date *</small>
        <Datepicker
          v-model="editedProject.startDate"
          name="project-start-date"
          required
          :validator="{ isValid: inputStates.startDate, message: 'Required'}"
          :max-value="editedProject.endDate"
          @input-state="childComponentState.startDate = $event"
        />
      </b-col>
      <b-col sm="6">
        <small>End date</small>
        <Datepicker
          v-model="editedProject.endDate"
          name="project-end-date"
          label="End date"
          :min-value="editedProject.startDate"
          @input-state="childComponentState.endDate = $event"
        />
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col class="mt-2 mb-2">
        <b-form-checkbox
          v-model="editedProject.isInternal"
        >
          Internal project, not done for a customer
        </b-form-checkbox>
      </b-col>
    </b-row>
    <b-row
      v-if="showCustomerName"
      class="my-4"
    >
      <b-col sm="6">
        <small for="project-customer-name-fi-input">Customer name (in Finnish) *</small>
        <b-form-group
          invalid-feedback="Required if project is not internal"
        >
          <b-form-input
            id="project-customer-name-fi-input"
            v-model="editedProject.customerName.fi"
            placeholder="Customer name (fi)"
            required
            type="text"
            :state="inputStates.customerNameFi"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <small for="project-customer-name-en-input">Customer name (in English) *</small>
        <b-form-group
          invalid-feedback="Required if project is not internal"
        >
          <b-form-input
            id="project-customer-name-en-input"
            v-model="editedProject.customerName.en"
            placeholder="Customer name (en)"
            required
            type="text"
            :state="inputStates.customerNameEn"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mb-6">
        <b-form-checkbox
          id="is-confidential-checkbox"
          v-model="editedProject.isConfidential"
        >
          <span id="is-confidential-checkbox-label">This is a confidential project</span>
        </b-form-checkbox>
        <b-popover
          target="is-confidential-checkbox-label"
          placement="right"
          triggers="hover focus"
          content="If the project is confidential, the customer name will be replaced in CV by Customer: confidential"
        />
      </b-col>
    </b-row>
    <b-row class="my-4">
      <b-col sm="6">
        <b-form-group invalid-feedback="Required">
          <small for="project-description-fi-input">Description (in Finnish) *</small>
          <b-textarea
            id="project-description-fi-input"
            v-model="editedProject.description.fi"
            :placeholder="isInternalCompanyProject ? 'Projektin kuvaus' : 'Kuvaile projektia ja mitä teit siinä'"
            type="text"
            rows="5"
            :state="inputStates.projectDescriptionFi"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group invalid-feedback="Required">
          <small for="project-description-en-input">Description (in English) *</small>
          <b-textarea
            id="project-description-en-input"
            v-model="editedProject.description.en"
            :placeholder="isInternalCompanyProject ? 'Project description' : 'Describe the project and what you did in it'"
            type="text"
            rows="5"
            :state="inputStates.projectDescriptionEn"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row v-show="isInternalCompanyProject">
      <b-col>
        <b-form-checkbox
          id="is-secret-checkbox"
          v-model="editedProject.isSecret"
        >
          <span id="is-secret-checkbox-label">This is a secret project</span>
        </b-form-checkbox>
        <b-popover
          target="is-secret-checkbox-label"
          placement="right"
          triggers="hover focus"
          content="If the project is secret, it will not show in CV"
        />
      </b-col>
    </b-row>
    <b-row class="my-4">
      <b-form-group
        id="profile-project-skill-form"
      >
        <b-col>
          <small>
            Skills related to project
          </small>
        </b-col>
        <b-col>
          <small
            v-show="!editedProject.skills || editedProject.skills.length === 0"
            class="mt-3 text-muted"
          >
            No skills added yet
          </small>
          <div
            v-for="skill of editedProject.skills"
            :key="skill.skillId"
            class="skill-item mx-1 my-1"
          >
            <span>
              {{ skill.name[currentLanguage] }}
              <Trash2Icon
                class="trash-icon svg-icon"
                size="1x"
                @click="removeSkillFromProject(skill)"
              />
            </span>
          </div>
        </b-col>
      </b-form-group>
      <b-col cols="12">
        <b-button
          v-b-modal.project-skill-modal
          variant="secondary"
        >
          Add skills to project
        </b-button>
      </b-col>
      <b-modal
        id="project-skill-modal"
        :title="`Add skills to project ${editedProject.name[currentLanguage]}`"
        ok-only
      >
        Click on a skill to add it to the project
        <b-input
          v-model="skillFilterText"
          class="my-3"
          type="text"
          placeholder="Filter by skill name"
        />
        <div
          v-for="skill in projectSkillList"
          :key="'project-skill-list-item-' + skill.id"
          class="skill-item clickable mx-1 my-1"
          @click.once="addSkillToProject(skill)"
        >
          {{ skill.name[currentLanguage] }}
        </div>
      </b-modal>
    </b-row>
    <slot name="custom-form" />
    <b-row class="my-4 float-left">
      <b-col>
        <b-button
          id="submit-project-edits-btn"
          class="mr-2 mb-2"
          type="submit"
          variant="primary"
          @click.prevent="onSubmit()"
        >
          {{ isNewProject ? 'Create a new project' : 'Update project' }}
        </b-button>
        <b-button
          v-show="showCancel"
          id="cancel-project-edits-btn"
          type="button"
          variant="light"
          @click.prevent="$emit('cancel')"
        >
          Cancel
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
import { mapGetters } from 'vuex'
import Datepicker from '@/components/helpers/Datepicker'
import { INTERNAL_COMPANY_NAME, LANGUAGE_ENUM } from '@/utils/constants'
import orderBy from 'lodash/orderBy'
import { Trash2Icon } from 'vue-feather-icons'

export default {
  name: 'ProjectForm',
  components: {
    Datepicker,
    Trash2Icon
  },
  props: {
    project: Object,
    formId: {
      type: String,
      default: 'project-form'
    },
    isNewProject: {
      type: Boolean,
      default: false
    },
    employerId: {
      type: Number,
      required: true
    },
    customFormValidation: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editedProject: this.initProject(),
      validated: false,
      skillFilterText: '',
      childComponentState: {
        startDate: true,
        endDate: true
      }
    }
  },
  computed: {
    ...mapGetters([
      'employerByName',
      'projects',
      'skillById',
      'skillGroupBySkillId',
      'skills',
      'currentLanguage'
    ]),
    internalCompanyId () {
      return this.employerByName(INTERNAL_COMPANY_NAME).id
    },
    existingProjectCodes () {
      const projectCodes = Object.values(this.projects).filter(project => project.employerId === this.internalCompanyId).map(project => project.code)
      return this.isNewProject ? projectCodes : projectCodes.filter(projectCode => projectCode !== this.project.code)
    },
    isInternalCompanyProject () {
      return this.employerId === this.internalCompanyId
    },
    showCustomerName () {
      return !this.editedProject.isInternal
    },
    projectSkillList () {
      if (this.skills) {
        const unorderedSkills = Object.values(this.skills)
          .filter(skill => {
            const skillGroup = this.skillGroupBySkillId(skill.id)
            const isLanguage = skillGroup ? skillGroup.title.en === LANGUAGE_ENUM.LANGUAGE_GROUP_NAME : false
            return !isLanguage && !this.editedProject.skills.map(projectSkill => projectSkill.id).includes(skill.id)
          })
          .map(skill => ({ ...skill, nameForFilter: skill.name[this.currentLanguage].toLowerCase() }))
        const filteredSkills = unorderedSkills.filter(skill => skill.nameForFilter.includes(this.skillFilterText.toLowerCase()))
        return orderBy(filteredSkills, [skill => skill.nameForFilter])
      }
      return []
    },
    isProjectCodeValid () {
      if (!this.validated) {
        return undefined
      } else {
        return this.projectCodeState.every(item => item.state)
      }
    },
    projectCodeState () {
      return [
        {
          state: !!this.editedProject.code,
          feedback: 'Required'
        },
        {
          state: this.editedProject.code ? !this.existingProjectCodes.includes(parseInt(this.editedProject.code)) : undefined,
          feedback: 'Project code already exists, code must be unique'
        }
      ]
    },
    inputStates () {
      return {
        startDate: this.validated ? !!this.editedProject.startDate : undefined,
        projectNameFi: this.validated ? this.editedProject.name.fi.length > 0 : undefined,
        projectNameEn: this.validated ? this.editedProject.name.en.length > 0 : undefined,
        customerNameFi: this.validated ? this.editedProject.customerName.fi.length > 0 || this.editedProject.isInternal : undefined,
        customerNameEn: this.validated ? this.editedProject.customerName.en.length > 0 || this.editedProject.isInternal : undefined,
        projectDescriptionFi: this.validated ? this.editedProject.description.fi.length > 0 : undefined,
        projectDescriptionEn: this.validated ? this.editedProject.description.en.length > 0 : undefined
      }
    },
    formIsValid () {
      const stateArray = [Object.entries(this.childComponentState).map(entry => entry[1])]
      // Required always
      for (let entry of Object.entries(this.inputStates)) {
        stateArray.push(entry[1])
      }
      // Required sometimes
      if (this.isInternalCompanyProject) {
        Array.prototype.push.apply(stateArray, this.projectCodeState.map(item => item.state))
      }
      if (this.showCustomerName) {
        stateArray.push(this.inputStates.customerNameFi, this.inputStates.customerNameEn)
      }
      return stateArray.every(item => item)
    }
  },
  methods: {
    onSubmit () {
      this.$emit('validate-custom-form')
      this.validated = true
      if (this.formIsValid) {
        this.validated = undefined
        this.$emit('on-submit', this.editedProject)
        if (this.isNewProject) {
          this.editedProject = this.initProject()
        }
      }
    },
    initProject () {
      return {
        id: !this.isNewProject ? this.project.id : null,
        code: !this.isNewProject ? this.project.code : null,
        startDate: !this.isNewProject ? new Date(this.project.startDate) : null,
        endDate: !this.isNewProject && this.project.endDate ? new Date(this.project.endDate) : null,
        isSecret: !this.isNewProject ? this.project.isSecret : false,
        isConfidential: !this.isNewProject ? this.project.isConfidential : true,
        isInternal: !this.isNewProject ? this.project.isInternal : false,
        name: !this.isNewProject && this.project.name ? { ...this.project.name } : { fi: '', en: '' },
        description: !this.isNewProject && this.project.description ? { ...this.project.description } : { fi: '', en: '' },
        customerName: !this.isNewProject && this.project.customerName ? { ...this.project.customerName } : { fi: '', en: '' },
        employerId: this.employerId,
        skills: !this.isNewProject ? this.project.skills : []

      }
    },
    addSkillToProject (skill) {
      this.editedProject.skills.push(skill)
    },
    removeSkillFromProject (skill) {
      this.editedProject.skills = this.editedProject.skills.filter(projectSkill => projectSkill.id !== skill.id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.skill-item {
  float: left;
  padding: 5px 10px;
  background-color: $c-light;
  border-radius: 10px;
}
.skill-item.clickable:hover {
  background-color: darken($color:  $c-light, $amount: 25);
  cursor: pointer;
}
.trash-icon {
  color: $c-violet-light;
}
.trash-icon:hover {
  color: $c-dark;
  cursor: pointer;
}
</style>
