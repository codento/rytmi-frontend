<template>
  <div>
    <b-card :title="fullName">
      <div>
        <b-form-group>
          <b-form-checkbox
            v-model="isAdmin"
            inline
          >
            Is admin?
          </b-form-checkbox>
          <b-form-checkbox
            v-model="isActive"
            inline
          >
            Is active?
          </b-form-checkbox>
        </b-form-group>
        <b-form-group
          id="roleLabel"
          label-cols-sm="2"
          label="Role:"
          label-for="roleInput"
        >
          <v-select
            id="roleInput"
            v-model="selectedEmployeeRoles"
            :options="employeeRoleList"
            multiple
          />
        </b-form-group>
        <b-form-group>
          <b-row>
            <b-col sm="3">
              <b-button
                variant="success"
                @click="submit"
              >
                Update
              </b-button>
            </b-col>
            <b-col
              sm="3"
              offset-sm="6"
            >
              <b-button
                variant="danger"
                @click="del"
              >
                Delete
              </b-button>
            </b-col>
          </b-row>
        </b-form-group>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'

export default {
  components: { vSelect },
  props: {
    user: {
      type: Object,
      required: true
    },
    update: {
      type: Function,
      required: true
    },
    delete: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      isAdmin: this.user.admin,
      isActive: this.user.active,
      profile: null,
      selectedEmployeeRoles: []
    }
  },
  computed: {
    ...mapGetters(['employeeRoles', 'profileById', 'profileByUserId']),
    fullName () {
      const { firstName, lastName } = this.user
      return `${firstName} ${lastName}`
    },
    employeeRoleList () {
      const roles = this.employeeRoles.map(item => {
        return {
          label: item.title,
          id: item.id
        }
      })
      return roles.filter(role => !this.selectedEmployeeRoles.some(selectedRole => selectedRole.id === role.id))
    }
  },
  watch: {
    user (newUser) {
      this.isAdmin = newUser.admin
      this.isActive = newUser.active
      this.profile = this.getActiveEmployeeProfile()
      this.selectedEmployeeRole = this.employeeRoleList.filter(role => this.profile.employeeRoles.includes(role.id))
    },
    selectedEmployeeRole (newRoles) {
      this.profile.employeeRoles = newRoles.map(role => role.id)
    }
  },
  created () {
    this.profile = this.getActiveEmployeeProfile()
    this.selectedEmployeeRoles = this.employeeRoleList.filter(role => this.profile.employeeRoles.includes(role.id))
  },
  methods: {
    submit () {
      this.update({ id: this.user.id, active: this.isActive, admin: this.isAdmin }, this.profile)
    },
    del () {
      const promptMessage = `
        Are you sure you want to delete the user?
        This action cannot be reverted!
        Write DELETE to confirm`
      const deletePrompt = prompt(promptMessage)
      if (deletePrompt === 'DELETE') {
        this.delete()
      }
    },
    getActiveEmployeeProfile () {
      return this.profileByUserId(this.user.id)
    }
  }
}
</script>
