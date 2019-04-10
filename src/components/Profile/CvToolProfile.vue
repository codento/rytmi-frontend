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
          <div
            v-if="orderedSkills.length == 0"
            style="color: grey"
          >
            No skills chosen, use checkboxes below to add skills!
          </div>
          <b-list-group
            id="top-skills"
            v-sortable="{onEnd: reorder}"
          >
            <b-list-group-item
              v-for="skill of orderedSkills"
              :key="skill.id"
              class="borderless"
            >
              <SkillRow
                v-bind="skill"
                show-skills-only
                disable-tooltip
              />
            </b-list-group-item>
          </b-list-group>
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
    },
    orderedSkills: function () {
      return this.relevantSkills
    }
  },
  created () {
    const descriptions = this.profile.cvDescriptions.find(description => description.type === 'introduction')
    this.profileDescription = descriptions ? descriptions.description : ''
    this.$emit('update-description', this.profileDescription)
  },
  methods: {
    formattedDate: (date) => {
      return format(date, 'D.M.YYYY')
    },
    reorder ({ oldIndex, newIndex }) {
      const movedItem = this.orderedSkills.splice(oldIndex, 1)[0]
      this.orderedSkills.splice(newIndex, 0, movedItem)
      this.$emit('update-skill-order', this.orderedSkills.map(skill => skill.id))
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
  #top-skills .borderless {
    border: 0px;
    cursor: pointer;
  }
</style>
