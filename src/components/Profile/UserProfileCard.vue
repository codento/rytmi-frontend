<template>
  <div class="profile-details">
    <div style="text-align: center;">
      <b-img
        alt="profile photo"
        :src="imgSrc"
        :blank="!imgSrc"
        height="128px"
        width="128px"
        @error="imgSrc = null"
      />
    </div>
    <div style="text-align: center; color:#869fac">
      <span class="profile-name"> {{ getNames }}</span><br>
    </div>
    <div>
      <div class="profileCardDetails profile-card-detail-row">
        <span
          v-for="role in employeeRoleList"
          :key="role.id"
        >
          {{ role.title }}
        </span>
      </div>
      <div class="profileCardDetails profile-card-detail-row">
        {{ profile.birthYear }}
      </div>
      <div class="profileCardDetails profile-card-detail-row">
        {{ profile.email }}
      </div>
      <div class="profileCardDetails profile-card-detail-row">
        {{ profile.phone }}
      </div>
      <br>
      <div
        v-if="profile.introduction"
        class="profileCardDetails profile-card-detail-row"
      >
        {{ profile.introduction[currentLanguage] }}
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
  data () {
    return {
      imgSrc: this.profile.photoPath
    }
  },
  computed: {
    ...mapGetters(['profileId', 'isAdmin', 'employeeRoles', 'currentLanguage']),
    getNames: function () {
      return this.profile ? this.profile.firstName + ' ' + this.profile.lastName : '-'
    },
    employeeRoleList: function () {
      const employeeRolesArray = Object.keys(this.employeeRoles).map(key => this.employeeRoles[key])
      return employeeRolesArray.filter(role => {
        return this.profile.employeeRoles.some(roleid => {
          return roleid === role.id
        })
      })
    }
  }
}
</script>

<style scoped>
.profile-details {
    text-align: center;
}
.profile-card-detail-row {
    margin-top: 0.5em;
}
.profile-name {
    font-size: 32px;
}
</style>
