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
        @updateDescription="profileDescriptionUpdated"
      />
    </b-col>
    <b-col cols="12">
      <CvToolSkills
        :skills="skills"
        @updateSelectedSkills="relevantSkillsUpdated"
      />
      <CvToolWorkExperience
        :profile-projects="projects"
        @updateSelectedProjects="relevantProjectsUpdated"
      />
      <CvToolOtherInfo
        :profile="profile"
        @updateMarkdown="markdownUpdated"
      />
    </b-col>
  </b-row>
</template>
<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'

import { DEFAULT_LANGUAGE } from '@/utils/language'

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
      'profileProjectsByProfileId',
      'projectById'
    ]),
    skills: function () {
      return this.skillsByProfileId(this.profile.id).filter(skill => skill.visibleInCV && skill.knows > 0)
    },
    topSkills: function () {
      return this.skills.filter(skill => this.cvData.relevantSkillIds.includes(skill.skillId))
    },
    projects: function () {
      return this.profileProjectsByProfileId(this.profile.id)
    },
    topProjects: function () {
      return this.cvData.relevantProjectIds.map(id => this.processProjectData(id))
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
    processProjectData: function (projectId) {
      const project = this.projectById(projectId)
      const description = project.descriptions.find(description => description.language === DEFAULT_LANGUAGE)
      const mappedProject = {
        id: project.id,
        code: project.code,
        duration: format(project.startDate, 'MM/YYYY') + '-' + format(project.endDate, 'MM/YYYY'),
        name: description ? description.name : '',
        description: description ? description.description : ''
      }
      return mappedProject
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
    createPDF: function () {
      const data = {
        'description': this.cvData.profileDescription,
        'relevantSkills': this.cvData.relevantSkillIds,
        'otherInfo': this.cvData.otherInfoAsMarkdown
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
