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
        <div
          v-for="skill in sortedSkills(profile.id)"
          :key="skill.skillId"
        >
          <b-row>
            <b-col
              cols="6"
              class="text-right skill-name-label"
            >
              {{ skillById(skill.skillId).name }}
            </b-col>
            <b-col class="knows-balls-containter">
              <span
                v-for="knows in knowsBalls(skill.knows)"
                :key="knows.index"
                :class="knows.knows ? 'knows-ball' : 'not-knows-ball'"
              />
            </b-col>
          </b-row>
        </div>
      </b-col>
      <b-col
        cols="12"
        md="1"
        class="profile-open-button"
      >
        <b-button
          id="open-profile"
          @click="openProfile(profile)"
        >
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
import { UtilizationChart } from '@/components/Common'
import ProfileCardProjectInfo from './ProfileCardProjectInfoRow'
import { mapGetters } from 'vuex'
import { LANGUAGE_ENUM } from '@/utils/constants'

export default {
  name: 'ProfileCard',
  components: { UtilizationChart, ProfileCardProjectInfo },
  props: {
    profile: Object,
    skillHighlight: Array,
    showAllSkills: Boolean
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'profileSkillsByProfileId',
      'skillById',
      'skillCategoryById',
      'futureProjectsOfProfile'
    ])
  },
  methods: {
    openProfile (profile) {
      this.$router.push({ name: 'profile', params: { id: profile.id } })
    },
    knowsBalls (knows) {
      const ballsArray = new Array(5)
      for (let i = 0; i < 5; i++) {
        if (i <= knows) {
          ballsArray[i] = { index: i, knows: true }
        } else {
          ballsArray[i] = { index: i, knows: false }
        }
      }
      return ballsArray
    },
    sortedSkills (profileId) {
      const sortedByProficiency = this.profileSkillsByProfileId(profileId).sort((a, b) => {
        if (b.knows > a.knows) { return 1 }
        if (b.knows < a.knows) { return -1 }
        return 0
      })
      const skillsToShow = sortedByProficiency.sort((a, b) => {
        if (this.skillHighlight.includes(b.skillId) && !this.skillHighlight.includes(a.skillId)) {
          return 1
        }
        if (this.skillHighlight.includes(a.skillId) && !this.skillHighlight.includes(b.skillId)) {
          return -1
        }
        return 0
      }).filter(skill => {
        if (this.showAllSkills) {
          return this.skillCategoryById(this.skillById(skill.skillId).skillCategoryId).title !== LANGUAGE_ENUM.LANGUAGE_GROUP_NAME
        } else {
          return this.skillHighlight.length > 0
            ? this.skillHighlight.find(skillId => skillId === skill.skillId)
            : this.skillCategoryById(this.skillById(skill.skillId).skillCategoryId).title !== LANGUAGE_ENUM.LANGUAGE_GROUP_NAME
        }
      })
      return skillsToShow.splice(0, 6)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
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
.knows-ball {
  background-color: $c-violet-dark;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  margin: 0 1px 0 1px;
}
.not-knows-ball {
  border: 1px solid $c-violet-dark;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  margin: 0 1px 0 1px;
}
.knows-balls-containter {
  display: flex;
  align-items: center;
}
.skill-name-label {
  display: flex;
  justify-content: flex-end;
  align-items: center; font-size: 1em;
  font-family: Arvo;
  font-style: italic;
}
</style>
