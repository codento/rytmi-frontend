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
      <hr>
      <b-form-group class="mb-4">
        <b-form-radio-group
          id="skill-grouping-options"
          v-model="selectedGrouping"
          :options="groupingOptions"
        />
      </b-form-group>
      <b-row
        v-for="category of skillsByGroupingOptions"
        :key="'category-' + category.id"
        class="mb-4"
      >
        <b-col
          v-show="selectedGrouping === 'category'"
          cols="12"
        >
          <h5>{{ category.category }}</h5>
        </b-col>
        <b-col cols="12">
          <b-row
            v-for="skill of category.skills"
            :key="'skill-' + skill.id"
            class="my-2"
            align-v="center"
          >
            <b-col cols="4">
              <b-form-checkbox
                :id="'skill-checkbox-' + skill.id"
                v-model="selectedSkills"
                :value="skill.skillId"
                :disabled="isNotSelectable(skill.skillId)"
              >
                {{ skill.skillName }}
              </b-form-checkbox>
            </b-col>
            <b-col>
              <b-progress
                :max="5"
                class="my-2"
              >
                <b-progress-bar
                  :value="skill.knows"
                  variant="c-orange"
                >
                  <slot name="label">
                    {{ skill.knows ? skill.knows.toString() : '' }}
                  </slot>
                </b-progress-bar>
              </b-progress>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card-body>
    <b-card-body>
      <b-card-title>Languages</b-card-title>
      <hr>
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
      selectedGrouping: 'name',
      groupingOptions: [
        { text: 'List by name', value: 'name' },
        { text: 'List by skill category', value: 'category' }
      ],
      maxSelected: 5
    }
  },
  computed: {
    ...mapGetters([
      'skillFilter',
      'topSkills'
    ]),
    skillsByGroupingOptions () {
      if (this.selectedGrouping === 'name') {
        return [
          {
            skills: this.skills,
            category: { id: 'skills-without-category' }
          }
        ]
      } else {
        return this.skillsByCategory
      }
    },
    skillsByCategory () {
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
  watch: {
    selectedSkills () {
      this.updateSelectedSkills()
    }
  },
  created () {
    if (this.skillFilter) {
      const profileSkillIds = this.skills.map(skill => skill.skillId)
      this.selectedSkills = profileSkillIds.filter(id => this.skillFilter.map(skill => skill.id).includes(id))
      this.updateSelectedSkills()
    }
  },
  methods: {
    ...mapActions(['updateTopSkills']),
    isNotSelectable (skillId) {
      return this.selectedSkills.length >= this.maxSelected && !(this.selectedSkills.includes(skillId))
    },
    updateSelectedSkills () {
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
