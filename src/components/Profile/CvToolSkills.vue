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
                id="skill.id"
                v-model="selectedSkills"
                type="checkbox"
                :value="skill.skillId"
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
import { mapGetters } from 'vuex'

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
      selectedSkills: []
    }
  },
  computed: {
    ...mapGetters([
      'skillCategories',
      'skillById',
      'skillFilter'
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
    this.$emit('update-selected-skills', this.selectedSkills)
  },
  methods: {
    updateSelectedSkills: function () {
      this.$emit('update-selected-skills', this.selectedSkills)
    }
  }
}
</script>
