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
      </b-col>
      <b-col
        cols="12"
        md="4"
        class="align-self-center"
        style="margin-top: 1em;"
      >
        <SkillRow
          v-for="skill in skillsByProfileId(profile.id)"
          :key="skill.id"
          v-bind="skill"
          :highlight="skillHighlight.includes(skill.skillId)"
        />
      </b-col>
      <b-col
        cols="12"
        md="1"
        class="profile-open-button"
      >
        <b-button @click="openProfile(profile)">
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
import { SkillRow, UtilizationChart } from '../Profile'
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileCard',
  components: { SkillRow, UtilizationChart },
  props: {
    profile: Object,
    skillHighlight: Array
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'skillsByProfileId',
      'skillById',
      'futureProjectsOfProfile'
    ])
  },
  methods: {
    openProfile (profile) {
      this.$router.push({ name: 'profile', params: { id: profile.id } })
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
        border: 0px;
        width: 100%;
    }
}
</style>
