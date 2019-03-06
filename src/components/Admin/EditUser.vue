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
export default {
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
      isActive: this.user.active
    }
  },
  computed: {
    fullName () {
      const { firstName, lastName } = this.user
      return `${firstName} ${lastName}`
    }
  },
  watch: {
    user (newUser) {
      this.isAdmin = newUser.admin
      this.isActive = newUser.active
    }
  },
  methods: {
    submit () {
      this.update({ id: this.user.id, active: this.isActive, admin: this.isAdmin })
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
    }
  }
}
</script>
