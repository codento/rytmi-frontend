<template>
  <b-container>
    <h2>Admin</h2>
    <b-row>
      <b-col sm="12" md="6">
        <UserList :users="profiles" @user-selected="setUser"/>
      </b-col>
      <b-col sm="12" md="6">
        <div id="edit-user-card">
          <EditUser v-if="selectedUser && selectedProfile" :user="selectedUser" :profile="selectedProfile" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import UserList from '@/components/Admin/UserList'
import EditUser from '@/components/Admin/EditUser'

export default {
  components: {
    UserList,
    EditUser
  },
  data () {
    return {
      selectedUser: null,
      selectedProfile: null
    }
  },
  computed: {
    ...mapGetters(['profiles'])
  },
  methods: {
    setUser (id) {
      this.selectedUser = this.profiles[id]
      this.selectedProfile = this.profiles[id]
    }
  }
}
</script>

<style lang="scss" scoped>
  @media only screen and (min-width: 992px) {
     #edit-user-card {
      position: fixed;
      width: 550px;
    }
  }
</style>
