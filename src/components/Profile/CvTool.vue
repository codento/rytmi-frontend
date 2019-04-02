<template>
  <b-row>
    <b-col
      cols="12"
      class="mb-2"
    >
      <CvToolProfile
        :profile="profile"
        @updateDescription="profileDescriptionUpdated"
      />
    </b-col>
    <b-col
      cols="12"
      class="mb-2"
    >
      <h5>Relevant skills</h5>
      <b-row>
        <b-col>
          <div
            v-if="relevantSkills.length == 0"
            style="color: grey"
          >
            No skills chosen, use checkboxes below to add skills!
          </div>
          <SkillRow
            v-for="skill of relevantSkills"
            :key="skill.id"
            v-bind="skill"
            show-skills-only
          />
        </b-col>
      </b-row>
    </b-col>
    <b-col cols="12">
      <CvToolSkills
        :skills="skills"
        @updateSelectedSkills="selectedSkillsUpdated"
      />
      <CvToolWorkExperience :profile="profile" />
      <CvToolOtherInfo
        :profile="profile"
        @updateMarkdown="markdownUpdated"
      />
    </b-col>
  </b-row>
</template>
<script>
import { mapGetters } from 'vuex'

import CvToolProfile from './CvToolProfile.vue'
import CvToolSkills from './CvToolSkills.vue'
import CvToolWorkExperience from './CvToolWorkExperience.vue'
import CvToolOtherInfo from './CvToolOtherInfo.vue'
import SkillRow from '@/components/Common/SkillRow.vue'

export default {
  name: 'CvTool',
  components: {
    SkillRow,
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
      selectedSkills: [],
      profileDescription: '',
      otherInfoAsMarkdown: ''
    }
  },
  computed: {
    ...mapGetters(['skillsByProfileId']),
    skills: function () {
      return this.skillsByProfileId(this.profile.id).filter(skill => skill.visibleInCV && skill.knows > 0)
    },
    relevantSkills: function () {
      return this.skills.filter(skill => this.selectedSkills.includes(skill.id))
    }
  },
  methods: {
    profileDescriptionUpdated: function (updatedDescription) {
      this.profileDescription = updatedDescription
    },
    selectedSkillsUpdated: function (updatedSkills) {
      this.selectedSkills = updatedSkills
    },
    markdownUpdated: function (updatedMarkdown) {
      this.otherInfoAsMarkdown = updatedMarkdown
    }
  }
}
</script>
