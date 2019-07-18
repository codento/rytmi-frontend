<template>
  <b-container>
    <h1>Admin</h1>
    <b-row>
      <b-col
        sm="12"
        md="6"
      >
        <UserList
          :users="users"
          @user-selected="setUser"
        />
      </b-col>
      <b-col
        sm="12"
        md="6"
      >
        <div id="edit-user-card">
          <loading v-if="updating" />
          <EditUser
            v-if="selectedUser && !updating"
            :user="selectedUser"
            :update="updateUserDetails"
            :delete="delUser"
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
      updating: false
    }
  },
  computed: {
    ...mapGetters(['users'])
  },
  mounted () {
    document.title = 'Rytmi - Admin'
  },
  methods: {
    ...mapActions(['updateUser', 'deleteUser', 'updateProfile']),
    setUser (id) {
      this.selectedUser = this.users[id]
    },
    async updateUserDetails (userAttributes, profileAttributes) {
      try {
        this.updating = true
        const { id } = await this.updateUser(userAttributes)
        await this.updateProfile(profileAttributes)
        this.updating = false
        this.setUser(id)
      } catch (error) {
        this.updating = false
      }
    },
    async delUser () {
      try {
        this.updating = true
        await this.deleteUser(this.selectedUser.id)
        this.updating = false
        this.setUser(null)
        this.$store.dispatch('fetchProfiles')
      } catch (error) {
        this.updating = false
      }
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
