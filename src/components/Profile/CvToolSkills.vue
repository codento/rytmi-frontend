<template>
  <b-card
    id="skills"
    class="mt-2 mb-2"
    no-body
  >
    <h5
      slot="header"
      class="mb-0"
    >
      Skills and languages
    </h5>
    <b-card-body>
      <b-card-title>Skills</b-card-title>
      <b-row
        v-for="category of skillsByCategory"
        :key="category.id"
      >
        <b-col
          cols="12"
          class="text-center mt-2"
        >
          <h5>{{ category.category }}</h5>
        </b-col>
        <b-col cols="12">
          <b-row
            v-for="skill of category.skills"
            :key="skill.id"
          >
            <b-col
              cols="1"
              align-self="center"
            >
              <input
                :id="'skill-checkbox-' + skill.id"
                v-model="selectedSkills"
                type="checkbox"
                :value="skill.skillId"
                :disabled="isNotSelectable(skill.skillId)"
                @change="updateSelectedSkills"
              >
            </b-col>
            <b-col>
              <SkillRow
                v-bind="skill"
                show-skills-only
                disable-tooltip
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card-body>
    <b-card-body>
      <b-card-title>Languages</b-card-title>
      <b-row
        v-for="language of languages"
        :key="language.id"
      >
        <b-col>
          <SkillRow
            v-bind="language"
            show-skills-only
          />
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

import SkillRow from '@/components/Common/SkillRow.vue'

export default {
  name: 'CvToolSkills',
  components: {
    SkillRow
  },
  props: {
    skills: Array,
    languages: Array
  },
  data () {
    return {
      selectedSkills: [],
      maxSelected: 5
    }
  },
  computed: {
    ...mapGetters([
      'skillFilter',
      'topSkills'
    ]),
    skillsByCategory: function () {
      const categories = []
      for (const skill of this.skills) {
        if (!categories.includes(skill.skillCategory)) {
          categories.push(skill.skillCategory)
        }
      }
      const categorisedSkills = categories.map(category => {
        const skills = []
        for (const skill of this.skills) {
          if (skill.skillCategory === category) {
            skills.push(skill)
          }
        }
        return {
          skills: skills,
          category: category
        }
      })
      return categorisedSkills
    }
  },
  created () {
    this.selectedSkills = this.skillFilter ? this.skillFilter.map(skill => skill.id) : []
    this.updateSelectedSkills()
  },
  methods: {
    ...mapActions(['updateTopSkills']),
    isNotSelectable: function (skillId) {
      return this.selectedSkills.length >= this.maxSelected && !(this.selectedSkills.includes(skillId))
    },
    updateSelectedSkills: function () {
      const updatedSkills = this.selectedSkills
        .map(skillId => this.skills.find(skill => skill.skillId === skillId))
      updatedSkills.sort((a, b) => {
        return this.topSkills.indexOf(a) > 0 ? this.topSkills.indexOf(a) - this.topSkills.indexOf(b) : 0
      })
      this.updateTopSkills(updatedSkills)
    }
  }
}
</script>
