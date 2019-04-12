<template>
  <div class="animated fadeIn">
    <h1>Previous employers</h1>
    <hr>
    <b-row>
      <b-col>
        Employers
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ProjectProfileForm } from '../Project'

export default {
  name: 'EditEmployers',
  props: {
    'profileId': Number
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'employersByProfileId'
    ])
  },
  methods: {

  },
  created () {
    console.log(this.employersByProfileId(this.profileId))
  }
}
</script>

<style scoped >
button {
  width: 100%;
}
.modal-btn {
  margin-top: 0.5rem;
}

</style>
