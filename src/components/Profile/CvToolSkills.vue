<template>
  <b-card
    id="skills"
    class="mt-2 mb-2"
  >
    <h5
      slot="header"
      class="mb-0"
    >
      Skills
    </h5>
    <b-row
      v-for="category of skillsByCategory"
      :key="category.id"
    >
      <b-col
        cols="12"
        class="text-center mt-2"
      >
        <h5>{{ skillCategories[category.category].title }}</h5>
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
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
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
    'skills': Array
  },
  data () {
    return {
      selectedSkills: []
    }
  },
  computed: {
    ...mapGetters([
      'skillCategories',
      'skillById'
    ]),
    skillsByCategory: function () {
      const categories = []
      for (const skill of this.skills) {
        if (!categories.includes(this.skillById(skill.skillId).skillCategoryId)) {
          categories.push(this.skillById(skill.skillId).skillCategoryId)
        }
      }
      const categorisedSkills = categories.map(category => {
        const skills = []
        for (const skill of this.skills) {
          if (this.skillById(skill.skillId).skillCategoryId === category) {
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
  methods: {
    updateSelectedSkills: function () {
      this.$emit('updateSelectedSkills', this.selectedSkills)
    }
  }
}
</script>
