<template>
  <b-row>
    <b-col cols="12">
      <UserProfileCard :profile="profile" />
    </b-col>
    <b-col cols="12">
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
          <SkillExplanations
            :know-desc="knowDesc"
            :want-desc="wantDesc"
          />
        </b-row>
        <b-row v-else>
          <b-col class="col mb-1">
            <SkillRow
              v-for="skill in profileSkillsByProfileId(profile.id)"
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
</template>

<script>
import { mapGetters } from 'vuex'
import proficiencyDesc from '@/assets/proficiencyDesc'
import UserProfileCard from './UserProfileCard.vue'
import { ProjectRow, SkillRow, SkillExplanations, UtilizationChart } from '@/components/Common'

export default {
  name: 'Profile',
  components: {
    ProjectRow,
    SkillRow,
    SkillExplanations,
    UtilizationChart,
    UserProfileCard
  },
  props: {
    profile: Object
  },
  data () {
    return {
      showInfo: false
    }
  },
  computed: {
    ...mapGetters([
      'skillById',
      'profileSkillsByProfileId',
      'profileProjectsByProfileId'
    ]),
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
  methods: {
    getSkills () {
      return this.profileSkillsByProfileId(this.profile.userId)
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
  }
}
</script>
