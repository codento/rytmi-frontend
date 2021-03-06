<template>
  <div>
    <b-card :title="fullName">
      <b-card>
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
            :options="employeeRoleList(selectedEmployeeRoles)"
            multiple
          />
        </b-form-group>
        <b-form-group>
          <b-row>
            <b-col sm="3">
              <b-button
                name="update"
                variant="primary"
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
                name="delete"
                variant="danger"
                @click="del"
              >
                Delete
              </b-button>
            </b-col>
          </b-row>
        </b-form-group>
      </b-card>
      <b-card>
        <b-form-group>
          <LeaveForm :profile="profile" />
        </b-form-group>
      </b-card>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'
import { LeaveForm } from '../Common/'

export default {
  components: { vSelect, LeaveForm },
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
    }
  },
  watch: {
    user (newUser) {
      this.isAdmin = newUser.admin
      this.isActive = newUser.active
      this.profile = this.getActiveEmployeeProfile()
      this.selectedEmployeeRoles = this.employeeRoleList([]).filter(role => this.profile.employeeRoles.includes(role.id))
    }
  },
  created () {
    this.profile = this.getActiveEmployeeProfile()
    this.selectedEmployeeRoles = this.employeeRoleList([]).filter(role => this.profile.employeeRoles.includes(role.id))
  },
  methods: {
    employeeRoleList (selectedRoles) {
      const roles = Object.keys(this.employeeRoles).map((key) => {
        return {
          label: this.employeeRoles[key].title,
          id: this.employeeRoles[key].id
        }
      })
      return roles.filter(role => !selectedRoles.some(selectedRole => selectedRole.id === role.id))
    },
    submit () {
      this.update(
        { id: this.user.id, active: this.isActive, admin: this.isAdmin },
        { id: this.profile.id, active: this.isActive, employeeRoles: this.selectedEmployeeRoles.map(role => role.id) })
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
      return { ...this.profileByUserId(this.user.id) }
    }
  }
}
</script>
