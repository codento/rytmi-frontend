<template>
  <div>
    <b-card :title="fullName">
      <div>
        <b-form-group>
          <b-form-checkbox v-model="isAdmin"> Is admin? </b-form-checkbox>
        </b-form-group>
        <b-form-group>
          <b-row>
            <b-col sm="3">
              <b-button variant="success">Update</b-button>
            </b-col>
            <b-col sm="3" offset-sm="6">
               <b-button variant="danger">Delete</b-button>
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
    profile: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isAdmin: true
    }
  },
  computed: {
    fullName () {
      const { firstName, lastName } = this.profile
      return `${firstName} ${lastName}`
    }
  }
}
</script>
