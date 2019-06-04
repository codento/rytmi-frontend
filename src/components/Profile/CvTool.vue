<template>
  <b-modal
    id="cv-tool-modal"
    size="lg"
  >
    <b-row>
      <b-col
        cols="12"
        class="mb-2"
      >
        <b-button-group
          v-for="languageButton in languageButtons"
          :key="languageButton.id"
          class="pull-right"
        >
          <b-button
            :id="languageButton.id"
            class="language-button"
            variant="outline-light"
            :pressed.sync="languageButton.state"
            @click="toggleLanguage(languageButton.id)"
          >
            {{ languageButton.label }}
          </b-button>
        </b-button-group>
        <CvToolProfile
          v-if="profile"
          :profile="profile"
          @update-introduction="cvIntroductionUpdated"
        />
      </b-col>
      <b-col cols="12">
        <CvToolSkills
          :skills="skills"
          :languages="languages"
        />
        <div v-if="projectsLoaded">
          <CvToolWorkExperience :profile-projects="projects" />
        </div>
        <CvToolEducation :education-list="profile.education ? profile.education : []" />
      </b-col>
    </b-row>
    <template v-slot:modal-footer>
      <div id="disabled-button-wrapper">
        <b-button
          id="open-create-cv-modal"
          v-b-modal.create-cv-modal
          :disabled="!allRequiredFieldsFilled"
        >
          Create CV
        </b-button>
        <b-tooltip
          :disabled.sync="allRequiredFieldsFilled"
          target="disabled-button-wrapper"
          placement="bottomright"
        >
          {{ disabledButtonInfo }}
        </b-tooltip>
        <b-modal
          id="create-cv-modal"
          ref="create-cv-modal"
          title="Export CV as PDF"
          hide-header-close
        >
          <b-row>
            <b-col cols="12">
              <label
                class="sm"
                for="pdf-name-input"
              >Enter filename for PDF</label>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12">
              <b-input-group append=".pdf">
                <b-form-input
                  id="pdf-name-input"
                  v-model="pdfName"
                  sm="6"
                  type="text"
                  :state="!containsInvalidCharacters(pdfName) && pdfName.length > 0"
                  required
                />
              </b-input-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12">
              <!-- This is intentionally done not using b-invalid-feedback to have the appended .pdf div work -->
              <div class="d-block invalid-feedback">
                <p v-if="containsInvalidCharacters(pdfName)">
                  Filename must not contain following characters: {{ invalidFilenameCharacters }}
                </p>
                <p v-if="pdfName.length === 0">
                  Filename cannot be empty
                </p>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12">
              <div v-if="cvExportPending">
                <LoadingSpinner />
              </div>
            </b-col>
          </b-row>
          <template
            slot="modal-footer"
            class="mx-1"
          >
            <b-button
              slot="modal-cancel"
              variant="danger"
              @click="hideModal()"
            >
              Cancel
            </b-button>
            <b-button
              slot="modal-ok"
              variant="primary"
              :class="!containsInvalidCharacters(pdfName) && pdfName.length > 0 ? '' : 'disabled'"
              :disabled.sync="cvExportPending"
              @click.prevent="startCvExport()"
            >
              Export
            </b-button>
          </template>
        </b-modal>
      </div>
    </template>
  </b-modal>
</template>
<script>
import clone from 'lodash/clone'
import { mapGetters, mapActions } from 'vuex'
import format from 'date-fns/format'
import CvToolProfile from './CvToolProfile.vue'
import CvToolSkills from './CvToolSkills.vue'
import CvToolWorkExperience from './CvToolWorkExperience.vue'
import CvToolEducation from './CvToolEducation.vue'
import LoadingSpinner from '@/components/helpers/LoadingSpinner.vue'
import proficiencyDesc from '@/assets/proficiencyDesc'
import staticTexts from '@/assets/cvStaticTexts'
import constants from '@/utils/constants'
const { LANGUAGE_ENUM } = constants

export default {
  name: 'CvTool',
  components: {
    CvToolProfile,
    CvToolSkills,
    CvToolWorkExperience,
    CvToolEducation,
    LoadingSpinner
  },
  props: {
    profile: Object
  },
  data () {
    return {
      isIntroductionValid: false,
      showButtonInfo: true,
      pdfName: '',
      invalidFilenameCharacters: '/:*?"<>|.[]'
    }
  },
  computed: {
    ...mapGetters([
      'currentLanguage',
      'profileSkillsByProfileId',
      'skillById',
      'skillCategoryById',
      'skillGroupById',
      'skillCategoryBySkillId',
      'skillGroupBySkillId',
      'profileProjectsByProfileId',
      'projectById',
      'cvIntroduction',
      'topSkills',
      'topProjects',
      'cvExportPending'
    ]),
    languageButtons: function () {
      return LANGUAGE_ENUM.LANGUAGES.map(item => ({ ...item, state: item.id === this.currentLanguage }))
    },
    skillsAndLanguages: function () {
      const profileSkills = this.profileSkillsByProfileId(this.profile.id)
      return profileSkills
        ? profileSkills
          .filter(skill => skill.visibleInCV && skill.knows > 0)
          .map(skill => this.joinSkillCategory(skill))
        : []
    },
    skills: function () {
      return this.skillsAndLanguages.filter(
        skill => skill.skillGroup !== LANGUAGE_ENUM.LANGUAGE_GROUP_NAME
      )
    },
    languages: function () {
      return this.skillsAndLanguages.filter(
        skill => skill.skillGroup === LANGUAGE_ENUM.LANGUAGE_GROUP_NAME
      )
    },
    projects: function () {
      return this.profileProjectsByProfileId(this.profile.id).map(
        profileProject => {
          const project = this.projectById(profileProject.projectId)
          if (project) {
            Object.assign(profileProject, {
              duration: this.getProjectDuration(profileProject),
              name: project.name,
              description: project.description,
              customerName: project.customerName
            })
          }
          return profileProject
        }
      )
    },
    projectsLoaded: function () {
      return this.projects.length > 0
        ? this.projects.every(project => project.hasOwnProperty('duration'))
        : false
    },
    defaultPDFName: function () {
      return `Codento CV ${this.profile.firstName} ${this.profile.lastName} ${this.currentLanguage.toUpperCase()}`
    },
    allRequiredFieldsFilled: {
      get: function () {
        return (
          this.topSkills.length > 0 &&
          this.isIntroductionValid &&
          this.topProjects.length > 0
        )
      },
      set: function () {}
    },
    disabledButtonInfo: function () {
      const missingInfo = []
      if (!this.isIntroductionValid) {
        missingInfo.push('profile description')
      }
      if (!this.topProjects.length) {
        missingInfo.push('relevant projects')
      }
      if (!this.topSkills.length) {
        missingInfo.push('top skills')
      }
      return 'Required info missing: '.concat(missingInfo.join(', '))
    }
  },
  updated () {
    this.pdfName = this.defaultPDFName
  },
  methods: {
    ...mapActions(['changeLanguage', 'downloadCv']),
    containsInvalidCharacters (text) {
      // Escape special characters for regexp
      const escapedCharacters = this.invalidFilenameCharacters.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      )
      const pattern = new RegExp('[' + escapedCharacters + ']')
      return pattern.test(text)
    },
    toggleLanguage: function (languageKey) {
      this.changeLanguage(languageKey)
      this.pdfName = this.defaultPDFName
    },
    getProjectDuration: function (project) {
      return (
        format(project.startDate, 'MM/YYYY') +
        '-' +
        format(project.endDate, 'MM/YYYY')
      )
    },
    cvIntroductionUpdated: function (inputState) {
      this.isIntroductionValid = inputState
    },
    joinSkillCategory: function (profileSkill) {
      const profileSkillCopy = clone(profileSkill)
      const skill = this.skillById(profileSkill.skillId)
      const skillCategory = this.skillCategoryBySkillId(skill.id)
      const skillGroup = this.skillGroupBySkillId(skill.id)
      if (skill && skillCategory && skillGroup) {
        profileSkillCopy['skillName'] = skill.name
        profileSkillCopy['skillCategory'] = skillCategory.title
        profileSkillCopy['skillGroup'] = skillGroup.title
      }
      return profileSkillCopy
    },
    hideModal () {
      this.$refs['create-cv-modal'].hide()
    },
    generateCvData () {
      function mapSkill (skillObj) {
        return {
          skillId: skillObj.skillId,
          skillName: skillObj.skillName,
          skillLevel: skillObj.knows,
          skillCategory: skillObj.skillCategory,
          skillGroup: skillObj.skillGroup
        }
      }
      function mapProject (projectObj) {
        return {
          projectId: projectObj.projectId,
          projectTitle: projectObj.title,
          projectName: projectObj.name,
          projectDescription: projectObj.description,
          projectCustomer: projectObj.customer,
          projectDuration: projectObj.duration
        }
      }
      const cvLanguages = this.languages.map(skill => {
        return {
          languageName: skill.skillName,
          languageLevel: skill.knows
        }
      })

      const cvSkills = this.skills.map(skill => mapSkill(skill))

      const cvProjects = this.projects.map(project => mapProject(project))

      return {
        employeeName: this.profile.firstName + ' ' + this.profile.lastName,
        employeePicture: this.profile.photoPath,
        jobTitle: this.profile.title,
        employeeDescription: this.cvIntroduction,
        topProjects: this.topProjects.map(project => mapProject(project)),
        topSkills: this.topSkills.map(skill => mapSkill(skill)),
        languages: cvLanguages,
        projects: cvProjects,
        skills: cvSkills,
        education: this.profile.education ? this.profile.education : [],
        born: this.profile.birthYear,
        skillLevelDescriptions: proficiencyDesc.knows[this.currentLanguage],
        staticTexts: staticTexts,
        currentLanguage: this.currentLanguage
      }
    },
    async startCvExport () {
      this.downloadCv({ cvData: this.generateCvData(), pdfName: this.pdfName })
        .then(response => {
          this.$toasted.global.rytmi_success({
            message: `${this.pdfName}.pdf succesfully downloaded`
          })
          this.hideModal()
        })
        .catch(error => {
          this.$toasted.global.rytmi_error({
            message: error
          })
          this.hideModal()
        })
    }
  }
}
</script>

<style scoped>
#disabled-button-wrapper {
  display: inline-block; /* display: block works as well */
  margin: 10px; /* make some space so the tooltip is visible */
}

#disabled-button-wrapper .btn :disabled {
  /* don't let button block mouse events from reaching wrapper */
  pointer-events: none;
}

.language-button.btn.btn-outline-light:not(.active) {
  color: darkslategrey;
}
</style>
