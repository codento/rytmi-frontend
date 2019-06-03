<template>
  <div class="profile-details">
    <div style="text-align: center;">
      <img
        alt="profile photo"
        :src="profile.photoPath"
      >
    </div>
    <div style="text-align: center; color:#869fac">
      <span class="profile-name"> {{ getNames }}</span><br>
      <a
        v-for="account in profile.accounts"
        :key="account.address"
        :class="getFAClass(account)"
        :href="account.address"
        style="padding: 4px;"
        class="fa"
      />
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
        {{ profile.introduction.en }}
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
    ...mapGetters(['profileId', 'isAdmin', 'employeeRoles']),
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
  },
  methods: {
    getFAClass: function (object) {
      return 'fa-'.concat(object.type)
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
