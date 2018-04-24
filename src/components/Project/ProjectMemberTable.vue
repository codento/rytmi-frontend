<template>
  <div>
    <div v-if="members">
      <b-table 
        :items="members"
        :fields="fields"
        hover
        striped
        caption-top
        @row-clicked="openProfile"
      >
        <template slot="table-caption">
          Consultants
        </template>
        <template slot="profileId" slot-scope="profileId">
          {{printMember(profileId.value)}}
        </template>
        <template slot="startAt" slot-scope="startDate">
          <DateFormatter :date="startDate.value" />
        </template>
        <template slot="finishAt" slot-scope="endDate">
          <DateFormatter :date="endDate.value" />
        </template>
        <template slot="workPercentage" slot-scope="percentage">
          {{percentage.value}} %
        </template>
        <template slot="remove" slot-scope="remove">
          <b-btn variation="danger" @click.stop="removeMember(remove.item)">Remove</b-btn>
        </template>
      </b-table>
    </div>
    <div v-else>
      No members added yet
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import DateFormatter from '../helpers/DateFormatter.vue'
export default {
  name: 'ProjectMemberTable',
  props: {
    members: Array
  },
  data () {
    return {
      fields: [
        { key: 'profileId', label: 'Name' },
        { key: 'startAt', label: 'From' },
        { key: 'finishAt', label: 'To' },
        { key: 'workPercentage', label: 'Utilization' },
        { key: 'remove', label: ' ' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'profileById'
    ])
  },
  methods: {
    ...mapActions([
      'removeProjectProfile'
    ]),
    printMember (profileId) {
      const member = this.profileById(profileId)
      if (member) {
        return member.firstName + ' ' + member.lastName
      } else {
        return 'Profile not found'
      }
    },
    openProfile (projectProfile) {
      this.$router.push({name: 'profile', params: { id: projectProfile.profileId }})
    },
    removeMember (projectProfile) {
      const confirmation = confirm('Are you sure?')
      if (confirmation) {
        this.removeProjectProfile(projectProfile)
          .then((reponse) => {
            this.$toasted.global.rytmi_success({
              message: 'Member removed!'
            })
          }).catch(err => {
            this.$toasted.global.rytmi_error({
              message: err
            })
          })
      }
    }
  },
  components: {
    DateFormatter
  }
}
</script>
