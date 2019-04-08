<template>
  <b-row>
    <b-col
      cols="12"
      class="mb-2"
    >
      <div id="disabled-button-wrapper">
        <b-button
          :disabled="!allRequiredFieldsFilled"
          @click="createPDF"
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
      </div>
      <CvToolProfile
        :profile="profile"
        :relevant-skills="topSkills"
        :relevant-projects="topProjects"
        @update-description="profileDescriptionUpdated"
      />
    </b-col>
    <b-col cols="12">
      <CvToolSkills
        :skills="skills"
        :languages="languages"
        @update-selected-skills="relevantSkillsUpdated"
      />
      <CvToolWorkExperience
        :profile-projects="projects"
        @update-selected-projects="relevantProjectsUpdated"
      />
      <CvToolOtherInfo
        :profile="profile"
        @update-markdown="markdownUpdated"
      />
    </b-col>
  </b-row>
</template>
<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { format } from 'date-fns'

import LANGUAGE_ENUM from '@/utils/constants'

import CvToolProfile from './CvToolProfile.vue'
import CvToolSkills from './CvToolSkills.vue'
import CvToolWorkExperience from './CvToolWorkExperience.vue'
import CvToolOtherInfo from './CvToolOtherInfo.vue'

export default {
  name: 'CvTool',
  components: {
    CvToolProfile,
    CvToolSkills,
    CvToolWorkExperience,
    CvToolOtherInfo
  },
  props: {
    'profile': Object
  },
  data () {
    return {
      cvData: {
        profileDescription: '',
        relevantSkillIds: [],
        relevantProjectIds: [],
        otherInfoAsMarkdown: ''
      },
      showButtonInfo: true
    }
  },
  computed: {
    ...mapGetters([
      'skillsByProfileId',
      'skillById',
      'skillCategoryById',
      'skillGroupById',
      'profileProjectsByProfileId',
      'projectById'
    ]),
    skillsAndLanguages: function () {
      return this.skillsByProfileId(this.profile.id)
        .filter(skill => skill.visibleInCV && skill.knows > 0)
        .map(skill => this.joinSkillCategory(skill))
    },
    skills: function () {
      return this.skillsAndLanguages.filter(skill => skill.skillGroup !== LANGUAGE_ENUM.LANGUAGE_GROUP_NAME)
    },
    languages: function () {
      return this.skillsAndLanguages.filter(skill => skill.skillGroup === LANGUAGE_ENUM.LANGUAGE_GROUP_NAME)
    },
    topSkills: function () {
      return this.skills.filter(skill => this.cvData.relevantSkillIds.includes(skill.skillId))
    },
    projects: function () {
      return this.profileProjectsByProfileId(this.profile.id)
        .map(profileProject => {
          const project = this.projectById(profileProject.projectId)
          Object.assign(profileProject, {
            duration: this.getProjectDuration(profileProject),
            name: project.name,
            description: project.description
          })
          return profileProject
        })
    },
    topProjects: function () {
      return this.projects.filter(project => this.cvData.relevantProjectIds.includes(project.projectId))
    },
    allRequiredFieldsFilled: {
      get: function () {
        return (this.cvData.relevantSkillIds.length > 0 && this.cvData.profileDescription.length > 0)
      },
      set: function () {}
    },
    disabledButtonInfo: function () {
      const missingFields = []
      if (!this.cvData.profileDescription) { missingFields.push('profile description') }
      if (!this.cvData.relevantProjectIds.length) { missingFields.push('relevant projects') }
      if (!this.cvData.relevantSkillIds.length) { missingFields.push('top skills') }
      return 'Required info missing: '.concat(missingFields.join(', '))
    }
  },
  methods: {
    getProjectDuration: function (project) {
      return format(project.startDate, 'MM/YYYY') + '-' + format(project.endDate, 'MM/YYYY')
    },
    profileDescriptionUpdated: function (updatedDescription) {
      this.cvData.profileDescription = updatedDescription
    },
    relevantSkillsUpdated: function (selectedSkills) {
      this.cvData.relevantSkillIds = selectedSkills
    },
    relevantProjectsUpdated: function (selectedProjects) {
      this.cvData.relevantProjectIds = selectedProjects
    },
    markdownUpdated: function (updatedMarkdown) {
      this.cvData.otherInfoAsMarkdown = updatedMarkdown
    },
    joinSkillCategory: function (profileSkill) {
      const profileSkillCopy = _.clone(profileSkill)
      const skill = this.skillById(profileSkill.skillId)
      const skillCategory = this.skillCategoryById(skill.skillCategoryId)
      profileSkillCopy['skillName'] = skill.name
      profileSkillCopy['skillCategory'] = skillCategory.title
      profileSkillCopy['skillGroup'] = this.skillGroupById(skillCategory.skillGroupId).title
      return profileSkillCopy
    },
    createPDF: function () {
      const cvLanguages = this.languages
        .map(skill => {
          return {
            languageName: skill.skillName,
            languageLevel: skill.knows
          }
        })

      const cvSkills = this.skills
        .map(skill => {
          return {
            skillId: skill.skillId,
            skillName: skill.skillName,
            skillLevel: skill.knows,
            skillCategory: skill.skillCategory,
            skillGroup: skill.skillGroup
          }
        })

      const cvProjects = this.projects
        .map(project => {
          return {
            projectId: project.projectId,
            projectTitle: project.name,
            projectDescription: project.description,
            projectCustomer: project.customer,
            projectDuration: project.duration
          }
        })

      const data = {
        employeeName: this.profile.firstName + ' ' + this.profile.lastName,
        employeePicture: this.profile.photoPath,
        jobTitle: this.profile.title,
        employeeDescription: this.cvData.profileDescription,
        topProjects: cvProjects.filter(project => this.cvData.relevantProjectIds.includes(project.projectId)),
        topSkills: cvSkills.filter(skill => this.cvData.relevantSkillIds.includes(skill.skillId)),
        languages: cvLanguages,
        projects: cvProjects,
        skills: cvSkills,
        otherInfo: this.cvData.otherInfoAsMarkdown
      }
      console.log(data)
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
</style>
