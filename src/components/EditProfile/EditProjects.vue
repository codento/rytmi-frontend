<template>
  <div class="animated fadeIn">
      <h1>Projects</h1>
      <hr />
      <b-row>
        <b-col class="col-12 col-md-7">
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

            <template slot="project" slot-scope="data">
              {{ projectById(data.item.projectId).name }}
            </template>

            <template slot="startDate" slot-scope="data">
              <date-formatter :date="data.value" format='D.M.YY'/>
            </template>

            <template slot="endDate" slot-scope="data">
              <date-formatter :date="data.value" format='D.M.YY'/>
            </template>

            <template slot="remove" slot-scope="data">
              <b-btn size="sm" class="mr-1" variant="danger" @click.stop="removeProjectProfile(data.item)">Remove</b-btn>
            </template>
          </b-table>
        </b-col>
        <b-col class="col-12 col-md-5">
          <b-card
            class="newProject"
            title="Add a new Project">
            <ProjectProfileForm :profileId="this.profileId" />
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
  props: {
    'profileId': Number
  },
  data () {
    return {
      fields: [
        {key: 'projectId', label: 'Code'},
        {key: 'project', label: 'Name'},
        {key: 'startDate', label: 'From'},
        {key: 'endDate', label: 'To'},
        {key: 'workPercentage', label: 'Utilization'},
        'remove'
      ]
    }
  },
  components: {
    DateFormatter,
    ProjectProfileForm
  },
  computed: {
    ...mapGetters([
      'profileProjectsByProfileId',
      'projectById'
    ])
  },
  methods: {
    ...mapActions([
    ])
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
