<template>
  <div class="profile-details" >
    <div style="text-align: center;">
      <img :src="profile.photoPath" />
    </div>
    <div style='text-align: center; color:#869fac'>
      <span class="profile-name"> {{getNames}}</span><br /> 
      <span class="profile-title" >{{profile.title}}</span>
      <a style="padding: 4px;" v-for="account in profile.accounts" class='fa' :class='getFAClass(account)' :href='account.address' :key="account.address"/>
    </div>
    <div >
      <div class="profileCardDetails profile-card-detail-row">
        {{profile.email}}
      </div>
      <div class="profileCardDetails profile-card-detail-row">
        {{profile.phone}}
      </div>
      <br/>
      <div class="profileCardDetails profile-card-detail-row">
        {{profile.description}}
      </div>
      <div v-if="profileId == profile.id" class="profile-card-detail-row">
        <a :href="'#/edit/' + profileId">Edit profile</a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'UserProfileCard',
  props: {
    'profile': Object
  },
  computed: {
    getNames: function () {
      if (this.profile) {
        return this.profile.firstName + ' ' + this.profile.lastName
      }
    },
    ...mapGetters(['profileId'])
  },
  methods: {
    getFAClass: function (object) {
      return 'fa-'.concat(object.type)
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped />
