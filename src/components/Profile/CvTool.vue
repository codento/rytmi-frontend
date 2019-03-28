<template>
  <b-row>
    <b-col cols="12">
      <div class="text-center">
        <img :src="profile.photoPath">
      </div>
    </b-col>
    <b-col
      cols="12"
      class="text-center"
    >
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
    </b-col>
    <b-col
      cols="12"
      class="mb-2"
    >
      <div class="profileCardDetails profile-card-detail-row">
        <b-textarea
          v-model="profileDescription"
          class="form-control"
          type="text"
          rows="6"
          placeholder="Add profile description for CV"
          :state="profileDescription.length > 0"
        />
      </div>
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
            <b-row>
              <b-col cols="1">
                <b-row
                  v-for="skill of category.skills"
                  :key="skill.id"
                >
                  <b-col>
                    <b-checkbox
                      :id="'skill_' + skill.id"
                      v-model="selectedSkills"
                      :value="skill.id"
                      class="pull-right"
                    />
                  </b-col>
                </b-row>
              </b-col>
              <b-col>
                <SkillRow
                  v-for="skill of category.skills"
                  :key="skill.id"
                  v-bind="skill"
                  show-skills-only
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-card>
      <b-card
        id="work-experience"
        class="mt-2 mb-2"
      >
        <h5
          slot="header"
          class="mb-0"
        >
          Work experience
        </h5>
        <h3>Codento</h3>
        <loading v-if="!profileProjects(profile.id)" />
        <ProjectRow
          v-for="profileProject in profileProjects(profile.id)"
          :key="profileProject.id"
          :profile-project="profileProject"
        />
        <h3>Other</h3>
      </b-card>
      <b-card
        id="other-cv-info"
        class="mt-2 mb-2"
      >
        <h5
          slot="header"
          class="mb-0"
        >
          Other information
        </h5>
        <b-row>
          <b-col>
            <b-textarea
              v-model="otherInfoAsMarkdown"
              rows="15"
              placeholder="Use Markdown"
              @input="update"
            />
          </b-col>
          <b-col>
            <div v-html="compiledMarkdown" />
          </b-col>
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import marked from 'marked'
import SkillRow from './SkillRow.vue'
import ProjectRow from './ProjectRow.vue'

export default {
  name: 'CvTool',
  components: {
    SkillRow,
    ProjectRow
  },
  props: {
    'profile': Object
  },
  data () {
    return {
      birthYear: 1987,
      profileProjects: (id) => this.profileProjectsByProfileId(id),
      profileDescription: '',
      selectedSkills: [],
      otherInfoAsMarkdown: ''
    }
  },
  computed: {
    ...mapGetters([
      'profileId',
      'skillsByProfileId',
      'skillName',
      'profileProjectsByProfileId',
      'projectById',
      'skillCategories',
      'skillById'
    ]),
    getNames: function () {
      return this.profile ? this.profile.firstName + ' ' + this.profile.lastName : '-'
    },
    compiledMarkdown: function () {
      return marked(this.otherInfoAsMarkdown, { sanitize: true })
    },
    skills: function () {
      return this.skillsByProfileId(this.profile.id).filter(skill => skill.visibleInCV && skill.knows > 0)
    },
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
    },
    relevantSkills: function () {
      return this.skills.filter(skill => this.selectedSkills.includes(skill.id))
    }
  },
  created: function () {
    // TODO
    this.profileDescription = this.profile.description || ''
    this.otherInfoAsMarkdown = this.profile.description || '## Education\nHogwards\n## Hobbies\nQuiddish'
  },
  methods: {
    getFAClass: function (object) {
      return 'fa-'.concat(object.type)
    },
    formattedDate: (date) => {
      return format(date, 'D.M.YYYY')
    },
    update: function () {
      _.debounce(function (e) {
        this.otherInfoAsMarkdown = e.target.value
      }, 300)
    },
    toggleSkillSelection: function (skillId) {
      if (this.selectedSkills.includes(skillId)) { this.selectedSkills = this.selectedSkills.filter(item => item !== skillId) } else { this.selectedSkills.push(skillId) }
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
