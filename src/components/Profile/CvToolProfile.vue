<template>
  <div class="text-center">
    <div>
      <img :src="profile.photoPath">
    </div>
    <div style="color:#869fac">
      <span class="profile-name"> {{ getNames }}</span><br>
      <span class="profile-title">{{ profile.title }}</span>
    </div>
    <div>
      <div>Born {{ birthYear }}</div>
      <div class="profileCardDetails profile-card-detail-row">
        {{ profile.email }}
      </div>
      <div class="profileCardDetails profile-card-detail-row">
        {{ profile.phone }}
      </div>
    </div>
    <div class="profileCardDetails profile-card-detail-row">
      <b-textarea
        v-model="profileDescription"
        class="form-control"
        type="text"
        rows="6"
        placeholder="Add profile description for CV"
        :state="profileDescription.length > 0"
        @update="updateDescription"
      />
    </div>
  </div>
</template>
<script>
import { format } from 'date-fns'

export default {
  name: 'CvToolProfile',
  props: {
    profile: Object
  },
  data () {
    return {
      birthYear: 1987,
      profileDescription: ''
    }
  },
  computed: {
    getNames: function () {
      return this.profile ? this.profile.firstName + ' ' + this.profile.lastName : '-'
    }
  },
  created: function () {
    // TODO
    this.profileDescription = this.profile.description || ''
    this.$emit('updateDescription', this.profileDescription)
  },
  methods: {
    formattedDate: (date) => {
      return format(date, 'D.M.YYYY')
    },
    updateDescription: function () {
      this.$emit('updateDescription', this.profileDescription)
    }
  }
}
</script>

<style scoped>
  .profile-card-detail-row {
    margin-top: 0.5em;
  }
  .profile-title {
    font-size: 13px;
  }
  .profile-name {
    font-size: 32px;
  }
</style>
