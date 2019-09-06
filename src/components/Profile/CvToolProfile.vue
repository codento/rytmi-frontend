<template>
  <div>
    <b-row align-v="center">
      <b-col
        cols="4"
        class="text-center"
      >
        <img
          alt="profile photo"
          :src="profile.photoPath"
        >
        <h4 class="my-2">
          {{ fullName }}
        </h4>
        <div>Born {{ profile.birthYear }}</div>
      </b-col>
      <b-col>
        <h3>{{ jobTitle }}</h3>
        <b-textarea
          id="input-introduction"
          v-model="modifiedIntroduction"
          class="form-control"
          type="text"
          rows="10"
          placeholder="Add profile description for CV"
          :state="introductionIsValid"
          @update="updateIntroduction"
        />
        <b-form-invalid-feedback
          id="input-introduction-feedback"
          class="text-left"
        >
          <div v-if="modifiedIntroduction.length === 0">
            Introduction cannot be empty
          </div>
          <div v-else>
            Maximum number of characters reached ({{ modifiedIntroduction.length }}/{{ maxIntroductionLength }})
          </div>
        </b-form-invalid-feedback>
        <div v-if="introductionIsValid">
          <p class="text-right text-success">
            {{ modifiedIntroduction.length }}/{{ maxIntroductionLength }}
          </p>
        </div>
      </b-col>
    </b-row>
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
            v-if="topProjects.length === 0"
            class="text-muted"
          >
            No relevant projects chosen, use checkboxes below to add projects!
          </div>
          <b-row
            v-for="project of topProjects"
            :key="project.id"
            class="justify-content-md-center mb-2 mt-2"
          >
            <b-col
              id="project-customer-label"
              class="mb-1 mt-2"
              cols="12"
            >
              <b>{{ project.customerName[currentLanguage] }}</b>
            </b-col>
            <b-col
              sm="12"
              md="7"
            >
              {{ project.name[currentLanguage] }}
            </b-col>
            <b-col
              sm="12"
              md="5"
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
          <b-list-group
            id="top-skills"
            v-sortable="{onEnd: reorder}"
            class="mb-2"
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
          <div
            v-if="orderedSkills.length === 0"
            class="text-muted"
          >
            No skills chosen, use checkboxes below to add skills!
          </div>
          <div
            v-else-if="orderedSkills.length > 1"
            class="text-center text-muted"
          >
            Order skills by dragging them
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

import SkillRow from '@/components/Common/SkillRow.vue'

export default {
  name: 'CvToolProfile',
  components: {
    SkillRow
  },
  props: {
    profile: Object,
    jobTitle: String
  },
  data () {
    return {
      modifiedIntroduction: '',
      maxIntroductionLength: 700
    }
  },
  computed: {
    ...mapGetters([
      'topSkills',
      'topProjects',
      'currentLanguage'
    ]),
    fullName: function () {
      return this.profile ? this.profile.firstName + ' ' + this.profile.lastName : '-'
    },
    orderedSkills: function () {
      return this.topSkills
    },
    introductionIsValid: function () {
      return this.modifiedIntroduction.length > 0 && this.modifiedIntroduction.length <= this.maxIntroductionLength
    }
  },
  created () {
    this.modifiedIntroduction = this.profile.introduction ? this.profile.introduction[this.currentLanguage] : ''
    this.updateIntroduction()
  },
  methods: {
    ...mapActions([
      'updateCvIntroduction',
      'updateTopSkills'
    ]),
    reorder ({ oldIndex, newIndex }) {
      const movedItem = this.orderedSkills.splice(oldIndex, 1)[0]
      this.orderedSkills.splice(newIndex, 0, movedItem)
      this.updateTopSkills(this.orderedSkills)
    },
    updateIntroduction: function () {
      this.updateCvIntroduction(this.modifiedIntroduction)
      this.$emit('update-introduction', this.introductionIsValid)
    }
  }
}
</script>

<style scoped>
  #input-introduction {
    font-size: 13px
  }
  #top-skills .borderless {
    border: 0;
    padding: 0.2rem;
    cursor: pointer;
  }
</style>
