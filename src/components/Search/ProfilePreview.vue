<template>
  <b-card>
    <b-row>
      <b-col class="col-sm-4" style="text-align:center">
        <img :src='this.profile.photoPath' alt="">
        <h3>{{this.profile.firstName}} {{this.profile.lastName}}</h3>
        <b>Email: {{this.profile.email}}</b><br>
        <b>puhelinnumero: {{this.profile.phone}}</b>
      </b-col>
      <b-col class="col-md-6">
        <b-col>
          <SkillRow v-for='skill in skillsByUserId(profile.id)'
            :name="skillById(skill.skillId).name"
            :knows='skill.knows'
            :wants='skill.wantsTo'
            :key='skill.id'>
          </SkillRow>
        </b-col>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="col-md-9"/>
      <b-col class="col-md-3">
      <b-button @click="openProfile(profile)">Go to profile</b-button>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { SkillRow } from '../Profile'

export default {
  name: 'profile-preview',
  props: {
    profile: {
      type: Object
    }
  },
  components: {
    SkillRow
  },
  methods: {
    openProfile (profile) {
      this.$router.replace({name: 'Profile', params: { id: profile.id }})
    }
  },
  computed: {
    ...mapGetters([
      'skillsByUserId',
      'skillById'
    ])
  }
}
</script>

