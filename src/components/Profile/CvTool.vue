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
          class="float-right"
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
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <CvToolProfile
          v-if="profile"
          :profile="profile"
          :job-title="jobTitle"
          @update-introduction="cvIntroductionUpdated"
          @update-job-title="cvJobTitleUpdated"
        />
      </b-col>
      <b-col cols="12">
        <CvToolSkills
          :skills="skills"
          :languages="languages"
        />
        <div v-if="projectsLoaded">
          <CvToolWorkExperience
            :profile-id="profile.id"
            :profile-projects="mappedProfileProjects"
          />
        </div>
        <CvToolEducation
          :education-list="profile.education ? profile.education : []"
          :certificate-or-other-list="profile.certificatesAndOthers ? profile.certificatesAndOthers : []"
        />
      </b-col>
    </b-row>
    <template v-slot:modal-footer>
      <div id="disabled-button-wrapper">
        <b-button
          id="get-cv-url-modal"
          v-b-modal.get-cv-url-modal
          :disabled="!allRequiredFieldsFilled"
          variant="primary"
          @click="startGetCvUrl()"
        >
          Get CV link
        </b-button>
        <b-button
          id="open-create-cv-modal"
          v-b-modal.create-cv-modal
          :disabled="!allRequiredFieldsFilled"
          variant="primary"
        >
          Create pdf CV
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
              variant="light"
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
        <b-modal
          id="get-cv-url-modal"
          title="Get cv url"
          hide-header-close
        >
          <b-row>
            <b-col cols="12">
              <div v-if="cvExportPending">
                <LoadingSpinner />
              </div>
              <b-link
                v-else-if="cvUrl"
                :href="cvUrl"
                target="_blank"
              >
                Click here to open CV in Google Slides
              </b-link>
            </b-col>
          </b-row>
          <template
            slot="modal-footer"
            class="mx-1"
          >
            <b-button
              slot="modal-cancel"
              variant="light"
              @click="$bvModal.hide('get-cv-url-modal')"
            >
              Close
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
import { LANGUAGE_ENUM, INTERNAL_COMPANY_NAME } from '@/utils/constants'

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
      invalidFilenameCharacters: '/:*?"<>|.[]',
      jobTitleForCv: ''
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
      'keySkills',
      'recentProjects',
      'cvExportPending',
      'employers',
      'employerById',
      'employerByName',
      'profileEmployersByProfileId',
      'cvUrl'
    ]),
    internalCompanyId () {
      return this.employerByName(INTERNAL_COMPANY_NAME).id
    },
    languageButtons: function () {
      return LANGUAGE_ENUM.LANGUAGES.map(item => ({ ...item, state: item.id === this.currentLanguage }))
    },
    skillsAndLanguages: function () {
      const profileSkills = this.profileSkillsByProfileId(this.profile.id)
      return profileSkills
        ? profileSkills
          .filter(skill => skill.knows > 0)
          .map(skill => this.joinSkillCategory(skill))
        : []
    },
    skills: function () {
      return this.skillsAndLanguages.filter(
        skill => !skill.isLanguage
      )
    },
    languages: function () {
      return this.skillsAndLanguages.filter(
        skill => skill.isLanguage
      )
    },
    mappedProfileProjects: function () {
      return this.profileProjectsByProfileId(this.profile.id).map(
        profileProject => {
          const project = this.projectById(profileProject.projectId)
          if (project) {
            return { ...project, ...profileProject, duration: this.getFormattedDuration(profileProject.startDate, profileProject.endDate) }
          }
          return profileProject
        }
      ).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    },
    projectsLoaded: function () {
      return this.mappedProfileProjects.length > 0
        ? this.mappedProfileProjects.every(project => project.hasOwnProperty('duration'))
        : false
    },
    defaultPDFName: function () {
      return `Codento CV ${this.profile.firstName} ${this.profile.lastName} ${this.currentLanguage.toUpperCase()}`
    },
    jobTitle () {
      const currentEmployer = this.profileEmployersByProfileId(this.profile.id).find(item => item.employerId === this.internalCompanyId)
      return currentEmployer ? currentEmployer.title[this.currentLanguage] : null
    },
    allRequiredFieldsFilled: {
      get: function () {
        return (
          this.keySkills.length > 0 &&
          this.isIntroductionValid &&
          this.recentProjects.length > 0
        )
      },
      set: function () {}
    },
    disabledButtonInfo: function () {
      const missingInfo = []
      if (!this.isIntroductionValid) {
        missingInfo.push('profile description')
      }
      if (!this.recentProjects.length) {
        missingInfo.push('recent projects')
      }
      if (!this.keySkills.length) {
        missingInfo.push('key skills')
      }
      return 'Required info missing: '.concat(missingInfo.join(', '))
    }
  },
  created () {
    this.pdfName = this.defaultPDFName
    this.jobTitleForCv = this.jobTitle
  },
  updated () {
    this.pdfName = this.defaultPDFName
  },
  methods: {
    ...mapActions(['changeLanguage', 'downloadCv', 'getCvUrl']),
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
    getFormattedDuration: function (startDate, endDate) {
      if (endDate && new Date(endDate).getMonth() === new Date(startDate).getMonth()) {
        return format(startDate, 'MM/YYYY')
      }
      return `${format(startDate, 'MM/YYYY')}-${endDate ? format(endDate, 'MM/YYYY') : ''}`
    },
    cvIntroductionUpdated: function (inputState) {
      this.isIntroductionValid = inputState
    },
    cvJobTitleUpdated (title) {
      this.jobTitleForCv = title
    },
    joinSkillCategory: function (profileSkill) {
      const profileSkillCopy = clone(profileSkill)
      const skill = this.skillById(profileSkill.skillId)
      const skillCategory = this.skillCategoryBySkillId(skill.id)
      const skillGroup = this.skillGroupBySkillId(skill.id)
      if (skill && skillCategory && skillGroup) {
        profileSkillCopy['skillName'] = skill.name[this.currentLanguage]
        profileSkillCopy['skillCategory'] = skillCategory.title[this.currentLanguage]
        profileSkillCopy['skillGroup'] = skillGroup.title[this.currentLanguage]
        profileSkillCopy['isLanguage'] = skillGroup.title.en === LANGUAGE_ENUM.LANGUAGE_GROUP_NAME
      }
      return profileSkillCopy
    },
    hideModal () {
      this.$refs['create-cv-modal'].hide()
    },
    mapProfileProjectForCV (profileProjectObj) {
      return {
        projectRole: profileProjectObj.role[this.currentLanguage],
        projectName: profileProjectObj.name[this.currentLanguage],
        projectDescription: profileProjectObj.description[this.currentLanguage],
        projectCustomer: !profileProjectObj.isInternal ? profileProjectObj.customerName[this.currentLanguage] : null,
        projectDuration: profileProjectObj.duration,
        projectSkills: profileProjectObj.skills.map(skill => skill.name[this.currentLanguage]),
        isConfidential: profileProjectObj.isConfidential
      }
    },
    mapSkillForCV (skillObj) {
      // CV uses a 3 point level system that joins levels 1 & 2 and leves 4 & 5 and uses the level name
      const setSkillLevelNameForCV = (level) => {
        switch (level) {
          case 1:
          case 2:
            return proficiencyDesc.knows[this.currentLanguage].filter(level => level.value === 2).map(level => level.text)[0]
          case 4:
          case 5:
            return proficiencyDesc.knows[this.currentLanguage].filter(level => level.value === 4).map(level => level.text)[0]
          default:
            return proficiencyDesc.knows[this.currentLanguage].filter(level => level.value === 3).map(level => level.text)[0]
        }
      }
      return {
        skillId: skillObj.skillId,
        skillName: skillObj.skillName,
        skillLevel: skillObj.knows,
        skillLevelName: setSkillLevelNameForCV(skillObj.knows),
        skillCategory: skillObj.skillCategory,
        skillGroup: skillObj.skillGroup
      }
    },
    generateCvData () {
      const cvLanguages = this.languages.map(skill => {
        return {
          languageName: skill.skillName,
          languageLevel: skill.knows
        }
      })

      const cvSkills = this.skills.map(skill => this.mapSkillForCV(skill))

      const workHistory = this.profileEmployersByProfileId(this.profile.id)
        .map(item => { return { ...item, employerName: this.employerById(item.employerId).name } })
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .map(item => {
          return {
            employerName: item.employerName,
            jobTitle: item.title[this.currentLanguage],
            jobDescription: item.description[this.currentLanguage],
            jobDuration: this.getFormattedDuration(item.startDate, item.endDate),
            projects: this.mappedProfileProjects.filter(project => project.employerId === item.employerId)
              .filter(project => !project.isSecret)
              .map(project => this.mapProfileProjectForCV(project))
          }
        })
      return {
        employeeName: this.profile.firstName + ' ' + this.profile.lastName,
        employeePicture: this.profile.photoPath,
        jobTitle: this.jobTitleForCv,
        employeeDescription: this.cvIntroduction,
        recentProjects: this.recentProjects.map(project => this.mapProfileProjectForCV(project)),
        keySkills: this.keySkills.map(skill => this.mapSkillForCV(skill)),
        languages: cvLanguages,
        workHistory: workHistory,
        skills: cvSkills,
        education: this.profile.education ? this.profile.education : [],
        certificatesAndOthers: this.profile.certificatesAndOthers ? this.profile.certificatesAndOthers : [],
        born: this.profile.birthYear,
        skillLevelDescriptions: [...proficiencyDesc.knows[this.currentLanguage]].slice(1, 5), // send only relevant descriptions to cv that has 3 levels of skills
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
    },
    async startGetCvUrl () {
      this.getCvUrl(this.generateCvData())
        .then(response => {
          this.$toasted.global.rytmi_success({
            message: `CV link succesfully generated`
          })
        })
        .catch(error => {
          this.$toasted.global.rytmi_error({
            message: error
          })
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

#get-cv-url-modal {
  margin-right: 10px;
}

.language-button.btn.btn-outline-light:not(.active) {
  color: darkslategrey;
}
</style>
