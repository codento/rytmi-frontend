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
            height="96px"
            width="96px"
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
          disable-tooltip
        />
      </b-col>
      <b-col
        cols="12"
        md="1"
        class="my-auto"
      >
        <ChevronRightIcon
          id="open-profile"
          size="5x"
          class="clickable"
          @click="openProfile(profile)"
        />
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { SkillRow, UtilizationChart } from '@/components/Common'
import ProfileCardProjectInfo from './ProfileCardProjectInfoRow'
import { mapGetters } from 'vuex'
import { ChevronRightIcon } from 'vue-feather-icons'

export default {
  name: 'ProfileCard',
  components: {
    SkillRow,
    UtilizationChart,
    ProfileCardProjectInfo,
    ChevronRightIcon
  },
  props: {
    profile: Object,
    skillHighlight: Array,
    showSkillsOnly: {
      type: Boolean,
      default: false
    },
    showAllSkills: Boolean
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'profileSkillsByProfileId',
      'skillById',
      'futureProjectsOfProfile'
    ])
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
      }).filter(skill => {
        if (this.showAllSkills) {
          return true
        } else {
          return this.skillHighlight.length > 0 ? this.skillHighlight.find(skillId => skillId === skill.skillId) : true
        }
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
.clickable {
  cursor: pointer;
}
</style>
