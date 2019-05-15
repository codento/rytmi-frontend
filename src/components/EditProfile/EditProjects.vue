<template>
  <div class="animated fadeIn">
    <h1>Projects</h1>
    <hr>
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
            slot-scope="data"
          >
            <span
              class="clickable"
              @click.stop="openProject(data.item.projectId)"
            >
              {{ projectById(data.item.projectId).code }}
            </span>
          </template>

          <template
            slot="project"
            slot-scope="data"
          >
            <span
              class="clickable"
              @click.stop="openProject(data.item.projectId)"
            >
              {{ projectById(data.item.projectId).name }}
            </span>
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
              @click.stop="removePP(data.item)"
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
            <small>Title (Finnish)</small>
            <b-input
              v-model="descriptionFi.title"
              type="text"
              required
            />
          </b-col>
          <b-col>
            <small>Title (English)</small>
            <b-input
              v-model="descriptionEn.title"
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
          class="modal-btn"
          @click="callUpdateProfileProjectAction()"
        >
          Save
        </b-btn>
        <b-btn
          id="cancel"
          class="modal-btn"
          @click="closeEditModal()"
        >
          Cancel
        </b-btn>
      </b-modal>
      <b-col class="col-12 projects-form">
        <b-card
          class="newProject"
          title="Join a project"
        >
          <ProjectProfileForm
            :profile-id="profileId"
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
        'edit',
        'remove'
      ],
      editedProfileProject: {}
    }
  },
  computed: {
    ...mapGetters([
      'profileProjectsByProfileId',
      'projectById',
      'profileById'
    ]),
    descriptionFi () {
      return this.getProfileProjectDescriptionByLanguage('fi')
    },
    descriptionEn () {
      return this.getProfileProjectDescriptionByLanguage('en')
    }
  },
  methods: {
    ...mapActions([
      'removeProfileProject',
      'updateProfileProject'
    ]),
    removePP (item) {
      const confirmation = confirm('Are you sure?')
      if (confirmation) {
        this.removeProfileProject(item)
      }
    },
    openProject (projectId) {
      this.$router.push(`/projects/${projectId}`)
    },
    openEditModal (item) {
      this.editedProfileProject = Object.assign({}, item.item)
      this.editedProfileProject.name = this.projectById(item.item.projectId).name
      this.editedProfileProject.startDate = new Date(this.editedProfileProject.startDate)
      this.editedProfileProject.endDate = this.editedProfileProject.endDate ? new Date(this.editedProfileProject.endDate) : null
      this.editedProfileProject.workPercentage = this.editedProfileProject.workPercentage
      this.editedProfileProject.index = item.index
      this.$refs.profileProjectEditModal.show()
    },
    closeEditModal () {
      this.$refs.profileProjectEditModal.hide()
    },
    callUpdateProfileProjectAction () {
      if (this.isDataValid()) {
        this.updateProfileProject(this.editedProfileProject)
          .then((response) => {
            this.$toasted.global.rytmi_success({
              message: 'Project information updated.'
            })
            this.$refs.profileProjectEditModal.hide()
          })
          .catch((err) => {
            this.$toasted.global.rytmi_error({
              message: err
            })
          })
      }
    },
    getProfileProjectDescriptionByLanguage (language) {
      if (!this.editedProfileProject.descriptions || !this.editedProfileProject.descriptions.find(description => description.language === language)) {
        return {
          language,
          title: ''
        }
      }
      return this.editedProfileProject.descriptions.find(description => description.language === language)
    },
    isDataValid () {
      if (!this.editedProfileProject.workPercentage || !this.descriptionEn.title || !this.descriptionFi.title) {
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

<style scoped >
button {
  width: 100%;
}
.modal-btn {
  margin-top: 0.5rem;
}

.clickable {
  cursor: pointer;
}
.clickable:hover {
  font-weight: bolder;
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
