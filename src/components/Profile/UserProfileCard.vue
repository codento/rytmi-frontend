<template>
  <div class="profile-details" >
    <div style="text-align: center;">
      <img :src="profile.photoPath" >
    </div>
    <div style="text-align: center; color:#869fac">
      <span class="profile-name"> {{ getNames }}</span><br >
      <span class="profile-title" >{{ profile.title }}</span>
      <a
        v-for="account in profile.accounts"
        :class="getFAClass(account)"
        :href="account.address"
        :key="account.address"
        style="padding: 4px;"
        class="fa"
      />
    </div>
    <div >
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
      <div
        v-if="profileId == profile.id"
        class="profile-card-detail-row"
      >
        <router-link :to="{ name: 'editProfile', params: { profileId: profileId }}">Edit profile</router-link>
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

<style scoped>
.profile {
    padding: 1em;
}
.profile-editor {
    padding: 1em;
}
.profile-details {
    text-align: center;
}
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
