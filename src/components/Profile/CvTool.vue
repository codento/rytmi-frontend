<template>
  <div >
    <div style="text-align: center;">
      <img :src="profile.photoPath">
    </div>
    <div style="text-align: center; color:#869fac">
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
      <br>
      <div class="profileCardDetails profile-card-detail-row">
        {{ profile.description }}
      </div>
      <b-card clasS="mt-2">
        <h3>Skills</h3>
        <div
          v-for="category of skillsByCategory"
          :key="category.id"
        >
          {{ skillCategories[category.category].title }}
          <p
            v-for="skill of category.skills"
            :key="skill.id"
          >
            {{ skillName(skill.skillId) }}
            {{ skill.knows }}
          </p>
        </div>
      </b-card>
      <b-card>
        <h3>Work experience</h3>
        <div
          v-for="project in profileProjects(profile.id)"
          :key="project.id"
        >
          <h4>{{ projectById(project.projectId).name }}</h4>
          <div>{{ `${formattedDate(project.startDate)} - ${project.endDate ? formattedDate(project.endDate) : ''}` }}</div>
        </div>
      </b-card>
    </div>
  </div>
</template>
<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'
export default {
  name: 'CvTool',
  props: {
    'profile': Object
  },
  data () {
    return {
      birthYear: 1987,
      profileProjects: (id) => this.profileProjectsByProfileId(id)
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
    skills: function () { return this.skillsByProfileId(this.profile.id) },
    skillsByCategory: function () {
      const categories = []
      for (const skill of this.skills) {
        if (!categories.includes(skill => this.skillById(skill.skillId).skillCategoryId)) {
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
    getFAClass: function (object) {
      return 'fa-'.concat(object.type)
    },
    formattedDate: (date) => {
      return format(date, 'D.M.YYYY')
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
