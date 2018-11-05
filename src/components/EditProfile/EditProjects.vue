<template>
  <div class="animated fadeIn">
    <h1>Projects</h1>
    <hr >
    <b-row>
      <b-col class="col-12 projects-table">
        <b-table
          :items="profileProjectsByProfileId(profileId)"
          :fields="fields"
          fixed
          caption-top
          stacked="sm"
        >
          <template slot="table-caption">
            Projects participated
          </template>

          <template
            slot="projectId"
            slot-scope="data">
            {{ projectById(data.item.projectId).code }}
          </template>

          <template
            slot="project"
            slot-scope="data">
            {{ projectById(data.item.projectId).name }}
          </template>

          <template
            slot="startDate"
            slot-scope="data">
            <date-formatter
              :date="data.value"
              format="D.M.YY"/>
          </template>

          <template
            slot="endDate"
            slot-scope="data">
            <date-formatter
              :date="data.value"
              format="D.M.YY"/>
          </template>

          <template
            slot="remove"
            slot-scope="data">
            <b-btn
              size="sm"
              class="mr-1"
              variant="danger"
              @click.stop="removePP(data.item)">Remove</b-btn>
          </template>
        </b-table>
      </b-col>
      <b-col class="col-12 projects-form">
        <b-card
          class="newProject"
          title="Add a new Project">
          <ProjectProfileForm :profile-id="profileId" />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DateFormatter from '../helpers/DateFormatter'
import { ProjectProfileForm } from '../Project'

export default {
  name: 'EditProjects',
  components: {
    DateFormatter,
    ProjectProfileForm
  },
  props: {
    'profileId': Number
  },
  data () {
    return {
      fields: [
        { key: 'projectId', label: 'Code' },
        { key: 'project', label: 'Name' },
        { key: 'startDate', label: 'From' },
        { key: 'endDate', label: 'To' },
        { key: 'workPercentage', label: 'Utilization' },
        'remove'
      ]
    }
  },
  computed: {
    ...mapGetters([
      'profileProjectsByProfileId',
      'projectById'
    ])
  },
  methods: {
    ...mapActions([
      'removeProfileProject'
    ]),
    removePP (item) {
      const confirmation = confirm('Are you sure?')
      if (confirmation) {
        this.removeProfileProject(item)
      }
    }
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

@media screen and (min-width: 1400px) {
  .projects-table {
    max-width: 66.6%
  }
  .projects-form {
    max-width: 33.2%
  }
}

</style>
