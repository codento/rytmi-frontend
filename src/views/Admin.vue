<template>
  <b-container>
    <h1>Admin</h1>
    <b-row>
      <b-col
        sm="12"
        md="6"
      >
        <b-button
          v-b-modal="'create-profile-modal'"
          class="mb-1 mt-2"
        >
          Create a new user
        </b-button>
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
    <b-modal
      id="create-profile-modal"
      hide-footer
      hide-header
    >
      <CreateUserForm />
    </b-modal>
  </b-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserList from '@/components/Admin/UserList'
import EditUser from '@/components/Admin/EditUser'
import CreateUserForm from '@/components/Admin/CreateUserForm'

export default {
  components: {
    UserList,
    EditUser,
    CreateUserForm
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
