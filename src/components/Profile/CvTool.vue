<template>
  <b-row>
    <b-col
      cols="12"
      class="mb-2"
    >
      <div id="disabled-button-wrapper">
        <b-button
          id="open-create-pdf-modal"
          v-b-modal.create-pdf-modal
          :disabled="!allRequiredFieldsFilled"
        >
          Create PDF
        </b-button>
        <b-tooltip
          :disabled.sync="allRequiredFieldsFilled"
          target="disabled-button-wrapper"
          placement="bottomright"
        >
          {{ disabledButtonInfo }}
        </b-tooltip>
        <b-modal
          id="create-pdf-modal"
          ref="create-pdf-modal"
          title="Create PDF"
          hide-footer
          hide-header-close
          @hide="resetPDF"
        >
          <b-row>
            <b-col
              cols="12"
              class="my-2"
            >
              <label
                class="sm"
                for="pdf-name-input"
              >
                Enter filename for PDF
              </label>
              <b-form-input
                id="pdf-name-input"
                v-model="pdfName"
                required
              />
            </b-col>
            <b-col
              cols="12"
              class="my-2"
            >
              <b-button
                id="create-cv-button"
                :disabled.sync="pdfDownloading"
                @click.prevent="createPDF"
              >
                Create PDF
              </b-button>
            </b-col>
            <b-col
              cols="12"
              class="my-2"
            >
              <div v-if="pdfDownloading">
                <LoadingSpinner />
              </div>
              <div
                v-else
                class="text-center"
              >
                <div v-if="pdfDownloaded">
                  File <strong>{{ pdfDownloaded }}.pdf</strong> succesfully downloaded
                </div>
                <div v-else-if="pdfDownloadError.length > 0">
                  {{ pdfDownloadError }}
                </div>
              </div>
            </b-col>
          </b-row>
          <b-button
            class="pull-right"
            variant="primary"
            @click="hideModal"
          >
            Close
          </b-button>
        </b-modal>
      </div>
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
        <CvToolWorkExperience
          :profile-projects="projects"
        />
      </div>
      <CvToolOtherInfo
        :profile="profile"
      />
    </b-col>
  </b-row>
</template>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import getYear from 'date-fns/get_year'
import format from 'date-fns/format'

import LANGUAGE_ENUM from '@/utils/constants'

import CvToolProfile from './CvToolProfile.vue'
import CvToolSkills from './CvToolSkills.vue'
import CvToolWorkExperience from './CvToolWorkExperience.vue'
import CvToolOtherInfo from './CvToolOtherInfo.vue'

import LoadingSpinner from '@/components/helpers/LoadingSpinner.vue'

export default {
  name: 'CvTool',
  components: {
    CvToolProfile,
    CvToolSkills,
    CvToolWorkExperience,
    CvToolOtherInfo,
    LoadingSpinner
  },
  props: {
    'profile': Object
  },
  data () {
    return {
      isIntroductionValid: false,
      showButtonInfo: true,
      pdfName: ''
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
      'cvOtherInfo',
      'topSkills',
      'topProjects',
      'pdfDownloading',
      'pdfDownloaded',
      'pdfDownloadError'
    ]),
    languageButtons: function () {
      return LANGUAGE_ENUM.LANGUAGES.map(item => _.extend(item, { state: (item.id === this.currentLanguage) }))
    },
    skillsAndLanguages: function () {
      const profileSkills = this.profileSkillsByProfileId(this.profile.id)
      return profileSkills ? profileSkills.filter(skill => skill.visibleInCV && skill.knows > 0).map(skill => this.joinSkillCategory(skill)) : []
    },
    skills: function () {
      return this.skillsAndLanguages.filter(skill => skill.skillGroup !== LANGUAGE_ENUM.LANGUAGE_GROUP_NAME)
    },
    languages: function () {
      return this.skillsAndLanguages.filter(skill => skill.skillGroup === LANGUAGE_ENUM.LANGUAGE_GROUP_NAME)
    },
    projects: function () {
      return this.profileProjectsByProfileId(this.profile.id)
        .map(profileProject => {
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
        })
    },
    projectsLoaded: function () {
      return this.projects.length > 0 ? this.projects.every(project => project.hasOwnProperty('duration')) : false
    },
    defaultPDFName: function () {
      return `Codento CV ${this.profile.firstName} ${this.profile.lastName} [${this.currentLanguage}]`
    },
    allRequiredFieldsFilled: {
      get: function () {
        return (this.topSkills.length > 0 && this.isIntroductionValid && this.topProjects.length > 0)
      },
      set: function () {}
    },
    disabledButtonInfo: function () {
      const missingInfo = []
      if (!this.isIntroductionValid) { missingInfo.push('profile description') }
      if (!this.topProjects.length) { missingInfo.push('relevant projects') }
      if (!this.topSkills.length) { missingInfo.push('top skills') }
      return 'Required info missing: '.concat(missingInfo.join(', '))
    }
  },
  mounted () {
    this.pdfName = this.defaultPDFName
    this.resetPDF()
  },
  methods: {
    ...mapActions([
      'changeLanguage',
      'downloadCv',
      'resetPDF'
    ]),
    toggleLanguage: function (languageKey) {
      this.changeLanguage(languageKey)
    },
    getProjectDuration: function (project) {
      return format(project.startDate, 'MM/YYYY') + '-' + format(project.endDate, 'MM/YYYY')
    },
    cvIntroductionUpdated: function (inputState) {
      this.isIntroductionValid = inputState
    },
    joinSkillCategory: function (profileSkill) {
      const profileSkillCopy = _.clone(profileSkill)
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
      this.$refs['create-pdf-modal'].hide()
      this.resetPDF()
    },
    createPDF: function () {
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
      const cvLanguages = this.languages
        .map(skill => {
          return {
            languageName: skill.skillName,
            languageLevel: skill.knows
          }
        })

      const cvSkills = this.skills
        .map(skill => mapSkill(skill))

      const cvProjects = this.projects
        .map(project => mapProject(project))

      const data = {
        employeeName: this.profile.firstName + ' ' + this.profile.lastName,
        employeePicture: this.profile.photoPath,
        jobTitle: this.profile.title,
        employeeDescription: this.cvIntroduction,
        topProjects: this.topProjects.map(project => mapProject(project)),
        topSkills: this.topSkills.map(skill => mapSkill(skill)),
        languages: cvLanguages,
        projects: cvProjects,
        skills: cvSkills,
        otherInfo: this.cvOtherInfo,
        born: getYear(this.profile.birthday)
      }
      this.downloadCv({ cvData: data, pdfName: this.pdfName })
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
