<template>
  <div class="animated fadeIn profile">
    <b-row>
      <b-col>
        <UserProfileCard :profile="profile"/>     
      </b-col>
      <b-col>
        <b-card id="proficiency">
          <h5 slot="header" class="mb-0">
            Proficiency
            <span style="float:right; cursor:pointer" v-on:mouseenter="showExplanations(true)" v-on:mouseout="showExplanations(false)">
              &#9432;
            </span>
          </h5>
          <b-row v-if="this.showInfo">
            <skillExplanations 
              :knowDesc='knowDesc'
              :wantDesc='wantDesc' />
          </b-row>
          <b-row v-else>
            <b-col class="col mb-1">
              <SkillRow v-for='skill in skillsByProfileId(profile.id)'
                :name="skillName(skill.skillId)"
                :knows='skill.knows'
                :wants='skill.wantsTo'
                :desc='skill.description'
                :key='skill.id'>
              </SkillRow>
            </b-col>
          </b-row>
        </b-card>
        <b-card header='Projects'>
          <ProjectRow v-for='project in profileProjects' :profileProject="project"  :key="project.projectId"/>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import store from '../store'
import proficiencyDesc from '../assets/proficiencyDesc'
import {
  ProjectRow,
  SkillExplanations,
  SkillRow,
  UserProfileCard
} from '../components/Profile'

export default {
  name: 'Profile',
  computed: {
    ...mapGetters([
      'profileById',
      'skillById',
      'skillsByProfileId',
      'profileProjectsByProfileId'
    ]),
    profile () {
      return this.profileById(this.$route.params.id)
    },
    knowDesc () {
      return proficiencyDesc.knows
    },
    wantDesc () {
      return proficiencyDesc.wants
    },
    profileProjects () {
      return this.profileProjectsByProfileId(this.profile.id)
    }
  },
  components: {
    SkillRow,
    ProjectRow,
    UserProfileCard,
    SkillExplanations
  },
  data () {
    return {
      showInfo: false
    }
  },
  methods: {
    getSkills () {
      return this.skillsByProfileId(this.profile.userId)
    },
    sortSkills (param) {
      return this.$lodash.orderBy(this.skills, ['wantsTo', 'name'], ['desc', 'asc']) // TODO Figure out how lodash should be handled in tests
    },
    skillName (skillId) {
      return this.skillById(skillId).name
    },
    showExplanations (show) {
      this.showInfo = show
    }
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('fetchProfileProjects', to.params.id)
    next()
  },
  mounted () {
    document.title = 'Rytmi - ' + this.profile.firstName + ' ' + this.profile.lastName
  }
}
</script>
