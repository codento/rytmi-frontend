<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col class="col-12 projects-table">
        <b-table
          v-if="projectList.length > 0"
          :items="projectList"
          :fields="fields"
          fixed
          caption-top
          stacked="sm"
        >
          <template slot="table-caption">
            Projects participated
          </template>
          <template
            slot="startDate"
            slot-scope="data"
          >
            {{ data.value | dateFilter }}
          </template>

          <template
            slot="endDate"
            slot-scope="data"
          >
            {{ data.value | dateFilter }}
          </template>

          <template
            slot="workPercentage"
            slot-scope="data"
          >
            <span>
              {{ data.value }} %
            </span>
          </template>

          <template
            slot="edit"
            slot-scope="data"
          >
            <b-btn
              size="sm"
              class="mr-1"
              variant="success"
              @click="openEditModal(data)"
            >
              Edit
            </b-btn>
          </template>
          <template
            slot="remove"
            slot-scope="data"
          >
            <b-btn
              name="remove"
              size="sm"
              class="mr-1"
              variant="danger"
              @click.stop="removeProfileProject(data.item)"
            >
              Remove
            </b-btn>
          </template>
        </b-table>
      </b-col>
      <b-modal
        ref="profileProjectEditModal"
        title=""
        hide-footer
        hide-header
      >
        <h3>{{ editedProfileProject.name }}</h3>
        <b-row>
          <b-col>
            <small>Your role in the project (in Finnish)</small>
            <b-input
              v-model="editedProfileProject.role.fi"
              placeholder="esim. front-end kehittäjä, ohjelmistoarkkitehti"
              type="text"
              required
            />
          </b-col>
          <b-col>
            <small>Your role in the project (in English)</small>
            <b-input
              v-model="editedProfileProject.role.en"
              placeholder="e.g. front-end developer, database admin"
              type="text"
              required
            />
          </b-col>
        </b-row>
        <small>Start date</small>
        <Datepicker
          v-model="editedProfileProject.startDate"
          name="edited-project-profile-start-date"
        />
        <small>End date</small>
        <Datepicker
          v-model="editedProfileProject.endDate"
          name="edited-project-profile-end-date"
        />
        <small>Utilization %</small>
        <b-input
          v-model="editedProfileProject.workPercentage"
          class="utilization-input"
          :min="0"
          :max="100"
          type="number"
        />
        <b-btn
          id="save"
          class="mt-2"
          @click="callUpdateProfileProjectAction()"
        >
          Save
        </b-btn>
        <b-btn
          id="close"
          variant="light"
          class="mt-2"
          @click="closeEditModal()"
        >
          Close
        </b-btn>
      </b-modal>
    </b-row>
    <b-row>
      <b-col class="col-12 projects-form">
        <b-card
          class="newProject"
          title="Join a project"
        >
          <ProjectProfileForm
            :profile-project="{ profileId }"
            no-redirect
          />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Datepicker from '../helpers/Datepicker'
import { mapActions, mapGetters } from 'vuex'
import { ProjectProfileForm } from '../Project'

export default {
  name: 'EditProjects',
  components: {
    ProjectProfileForm,
    Datepicker
  },
  props: {
    profileId: Number
  },
  data () {
    return {
      fields: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'startDate', label: 'From' },
        { key: 'endDate', label: 'To' },
        { key: 'workPercentage', label: 'Utilization' },
        'edit',
        'remove'
      ],
      editedProfileProject: {
        role: {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'profileProjectsByProfileId',
      'projectById',
      'profileById',
      'currentLanguage'
    ]),
    projectList () {
      return this.profileProjectsByProfileId(this.profileId).map(profileProject => {
        return {
          ...profileProject,
          code: this.projectById(profileProject.projectId).code,
          name: this.projectById(profileProject.projectId).name[this.currentLanguage]
        }
      })
    }
  },
  methods: {
    ...mapActions([
      'removeProfileProject',
      'updateProfileProject'
    ]),
    removeProfileProject (item) {
      const confirmation = confirm('Are you sure?')
      if (confirmation) {
        this.removeProfileProject(item)
      }
    },
    openEditModal (item) {
      this.editedProfileProject = Object.assign({}, item.item)
      this.editedProfileProject.name = this.projectById(item.item.projectId).name
      this.editedProfileProject.startDate = new Date(this.editedProfileProject.startDate)
      this.editedProfileProject.endDate = this.editedProfileProject.endDate ? new Date(this.editedProfileProject.endDate) : null
      this.editedProfileProject.index = item.index
      this.$refs.profileProjectEditModal.show()
    },
    closeEditModal () {
      this.$refs.profileProjectEditModal.hide()
    },
    async callUpdateProfileProjectAction () {
      if (this.isDataValid()) {
        try {
          await this.updateProfileProject(this.editedProfileProject)
          this.$toasted.global.rytmi_success({
            message: 'Project information updated.'
          })
          this.$refs.profileProjectEditModal.hide()
        } catch (err) {
          this.$toasted.global.rytmi_error({
            message: err
          })
        }
      }
    },
    isDataValid () {
      if (!this.editedProfileProject.workPercentage || !this.editedProfileProject.fi.role || !this.editedProfileProject.en.role) {
        this.$toasted.global.rytmi_error({
          message: 'Not all fields have data, please fill them in.'
        })
        return false
      }
      if (this.editedProfileProject.endDate && this.editedProfileProject.startDate > this.editedProfileProject.endDate) {
        this.$toasted.global.rytmi_error({
          message: 'Start date can\'t be after end date.'
        })
        return false
      }
      if (this.editedProfileProject.workPercentage > 100) {
        this.$toasted.global.rytmi_error({
          message: 'Utilization percent can\'t be over 100.'
        })
        return false
      }
      if (this.editedProfileProject.workPercentage < 0) {
        this.$toasted.global.rytmi_error({
          message: 'Utilization percent can\'t be under 0.'
        })
        return false
      }
      return true
    }
  }
}
</script>
