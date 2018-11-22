<template>
  <b-container class="animated fadeIn profile">
    <loading v-if="!profile" />
    <b-row v-else>
      <b-col class="col-md-6 col-sm-12 col-12">
        <UserProfileCard :profile="profile" />
      </b-col>
      <b-col class="col-md-6 col-sm-12 col-12">
        <b-card id="proficiency">
          <h5
            slot="header"
            class="mb-0"
          >
            Proficiency
            <span
              style="float:right; cursor:pointer"
              @mouseenter="showExplanations(true)"
              @mouseout="showExplanations(false)"
            >
              &#9432;
            </span>
          </h5>
          <b-row v-if="showInfo">
            <skillExplanations
              :know-desc="knowDesc"
              :want-desc="wantDesc"
            />
          </b-row>
          <b-row v-else>
            <b-col class="col mb-1">
              <SkillRow
                v-for="skill in skillsByProfileId(profile.id)"
                :key="skill.id"
                v-bind="skill"
              />
            </b-col>
          </b-row>
        </b-card>
        <b-card header="Projects">
          <loading v-if="!profileProjects" />
          <ProjectRow
            v-for="profileProject in profileProjects"
            v-else
            :key="profileProject.id"
            :profile-project="profileProject"
          />
        </b-card>
        <b-card header="Utilization">
          <loading v-if="!profileProjects" />
          <UtilizationChart
            v-else
            :projects="profileProjects"
          />
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '../store'
import proficiencyDesc from '../assets/proficiencyDesc'
import {
  ProjectRow,
  SkillExplanations,
  SkillRow,
  UserProfileCard,
  UtilizationChart
} from '../components/Profile'

export default {
  name: 'Profile',
  components: {
    SkillRow,
    ProjectRow,
    UserProfileCard,
    SkillExplanations,
    UtilizationChart
  },
  data () {
    return {
      showInfo: false
    }
  },
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
  watch: {
    profile: function (val, oldVal) {
      if (val) {
        document.title = `Rytmi - ${val.firstName} ${val.lastName}`
      }
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
    store.dispatch('fetchPPsOfProfile', to.params.id)
    next()
  }
}
</script>
