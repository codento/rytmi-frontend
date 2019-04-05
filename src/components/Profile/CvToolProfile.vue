<template>
  <div>
    <div class="text-center">
      <div>
        <img :src="profile.photoPath">
      </div>
      <div style="color:#869fac">
        <span class="profile-name"> {{ getNames }}</span><br>
        <span class="profile-title">{{ profile.title }}</span>
      </div>
      <div>
        <div>Born {{ birthYear }}</div>
        <div class="profileCardDetails profile-card-detail-row">
          {{ profile.email }}
        </div>
        <div class="profileCardDetails profile-card-detail-row">
          {{ profile.phone }}
        </div>
      </div>
      <div class="profileCardDetails profile-card-detail-row">
        <b-textarea
          v-model="profileDescription"
          class="form-control"
          type="text"
          rows="6"
          placeholder="Add profile description for CV"
          :state="profileDescription.length > 0"
          @update="updateDescription"
        />
      </div>
    </div>
    <b-row>
      <b-col
        md="12"
        lg="6"
      >
        <b-card
          class="mt-2 mb-2"
          title="Relevant projects"
        >
          <div
            v-if="relevantProjects.length == 0"
            style="color: grey"
          >
            No relevant projects chosen, use checkboxes below to add projects!
          </div>
          <b-row
            v-for="project of relevantProjects"
            :key="project.id"
            class="justify-content-md-center mb-2 mt-2"
          >
            <b-col
              sm="12"
              md="6"
            >
              {{ project.name }}
            </b-col>
            <b-col
              sm="12"
              md="6"
            >
              <strong>{{ project.duration }}</strong>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col
        md="12"
        lg="6"
      >
        <b-card
          class="mt-2 mb-2"
          title="Top skills"
        >
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
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { format } from 'date-fns'

import SkillRow from '@/components/Common/SkillRow.vue'

export default {
  name: 'CvToolProfile',
  components: {
    SkillRow
  },
  props: {
    profile: Object,
    relevantSkills: Array,
    relevantProjects: Array
  },
  data () {
    return {
      birthYear: 1987,
      profileDescription: ''
    }
  },
  computed: {
    getNames: function () {
      return this.profile ? this.profile.firstName + ' ' + this.profile.lastName : '-'
    }
  },
  created: function () {
    // TODO
    this.profileDescription = this.profile.description || ''
    this.$emit('update-description', this.profileDescription)
  },
  methods: {
    formattedDate: (date) => {
      return format(date, 'D.M.YYYY')
    },
    updateDescription: function () {
      this.$emit('update-description', this.profileDescription)
    }
  }
}
</script>

<style scoped>
  .profile-card-detail-row {
    margin-top: 0.5em;
  }
  .profile-title {
    font-size: 13px;
  }
  .profile-name {
    font-size: 32px;
  }
</style>
