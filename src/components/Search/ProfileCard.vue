<template>
  <b-card>
    <b-row>
      <b-col
        cols="12"
        md="3"
        style="text-align:center"
      >
        <span
          style="cursor: pointer"
          name="open-profile"
          @click="openProfile(profile)"
        >
          <img
            :src="profile.photoPath"
            alt=""
          >
          <h3>{{ profile.firstName }} {{ profile.lastName }}</h3>
        </span>
        <b>{{ profile.email }}</b><br>
        <b>{{ profile.phone }}</b>
      </b-col>
      <b-col
        cols="12"
        md="4"
        class="align-self-center"
      >
        <UtilizationChart :projects="futureProjectsOfProfile(profile.id)" />
        <ProfileCardProjectInfo :profile="profile" />
      </b-col>
      <b-col
        cols="12"
        md="4"
        class="align-self-center"
        style="margin-top: 1em;"
      >
        <SkillRow
          v-for="skill in sortedSkills(profile.id)"
          :key="skill.id"
          v-bind="skill"
          :highlight="skillHighlight.includes(skill.skillId)"
          :show-skills-only="showSkillsOnly"
        />
        <b-row
          v-if="skillHighlight.length > 1"
          align-h="end"
          no-gutters
        >
          {{ `Sum of selected skills: ${highlightedSum}` }}
        </b-row>
      </b-col>
      <b-col
        cols="12"
        md="1"
        class="profile-open-button"
      >
        <b-button id="open-profile" @click="openProfile(profile)">
          <i
            style="font-size: 76px; color: gray;"
            class="fa fa-5x fa-angle-right"
          />
        </b-button>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { SkillRow, UtilizationChart } from '@/components/Common'
import ProfileCardProjectInfo from './ProfileCardProjectInfoRow'
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileCard',
  components: { SkillRow, UtilizationChart, ProfileCardProjectInfo },
  props: {
    profile: Object,
    skillHighlight: Array,
    showSkillsOnly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'profileSkillsByProfileId',
      'skillById',
      'futureProjectsOfProfile'
    ]),
    highlightedSum: function () {
      const highlightedSkills = this.skillHighlight.map(skillId => {
        return this.profileSkillsByProfileId(this.profile.id).find(skill => skill.skillId === skillId).knows
      })
      return highlightedSkills.reduce((a, b) => a + b)
    }
  },
  methods: {
    openProfile (profile) {
      this.$router.push({ name: 'profile', params: { id: profile.id } })
    },
    sortedSkills (profileId) {
      const sortedByProficiency = this.profileSkillsByProfileId(profileId).sort((a, b) => {
        if (b.knows > a.knows) { return 1 }
        if (b.knows < a.knows) { return -1 }
        return 0
      })
      return sortedByProficiency.sort((a, b) => {
        if (this.skillHighlight.includes(b.skillId) && !this.skillHighlight.includes(a.skillId)) {
          return 1
        }
        if (this.skillHighlight.includes(a.skillId) && !this.skillHighlight.includes(b.skillId)) {
          return -1
        }
        return 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  object-fit: contain;
  margin-left: 10px
}
.profile-open-button {
    margin: 0 auto;
    button {
        height: 100%;
        background: #fff;
        border: 0;
        width: 100%;
    }
}
</style>
