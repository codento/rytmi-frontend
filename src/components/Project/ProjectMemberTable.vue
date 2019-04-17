<template>
  <div>
    <div v-if="members">
      <b-table
        :items="members"
        :fields="fields"
        hover
        striped
        stacked="sm"
        caption-top
      >
        <template slot="table-caption">
          Consultants (click value to edit)
        </template>
        <template
          slot="profileId"
          slot-scope="profileId"
        >
          <span
            class="clickable"
            @click.stop="openProfile(profileId.value)"
          >
            {{ printMember(profileId.value) }}
          </span>
        </template>
        <template
          slot="startDate"
          slot-scope="element"
        >
          <span
            class="clickable"
            @click.stop="openEditModal(element)"
          >
            {{ element.value | dateFilter }}
          </span>
        </template>
        <template
          slot="endDate"
          slot-scope="element"
        >
          <span
            class="clickable"
            @click.stop="openEditModal(element)"
          >
            {{ element.value | dateFilter }}
          </span>
        </template>
        <template
          slot="workPercentage"
          slot-scope="element"
        >
          <span
            class="clickable"
            @click.stop="openEditModal(element)"
          >
            {{ element.value }} %
          </span>
        </template>
        <template
          slot="remove"
          slot-scope="remove"
        >
          <b-btn
            size="sm"
            class="mr-1"
            variant="danger"
            @click.stop="removeMember(remove.item)"
          >
            Remove
          </b-btn>
        </template>
      </b-table>
    </div>
    <div v-else>
      No members added yet
    </div>
    <b-modal
      ref="projectProfileEditModal"
      title="ASD"
      hide-footer
      hide-header
    >
      <h3>{{ printMember(editedProjectProfile.profileId) }}</h3>
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
        v-model="editedProjectProfile.startDate"
        name="edited-project-profile-start-date"
      />
      <small>End date</small>
      <Datepicker
        v-model="editedProjectProfile.endDate"
        name="edited-project-profile-end-date"
      />
      <small>Utilization %</small>
      <b-input
        v-model="editedProjectProfile.workPercentage"
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
  </div>
</template>
<script>
import Datepicker from '../helpers/Datepicker'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProjectMemberTable',
  components: { Datepicker },
  props: {
    members: Array
  },
  data () {
    return {
      fields: [
        { key: 'profileId', label: 'Name' },
        { key: 'startDate', label: 'From' },
        { key: 'endDate', label: 'To' },
        { key: 'workPercentage', label: 'Utilization' },
        { key: 'remove', label: ' ' }
      ],
      editedProjectProfile: {}
    }
  },
  computed: {
    ...mapGetters(['profileById']),
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
    printMember (profileId) {
      const member = this.profileById(profileId)
      if (member) {
        return member.firstName + ' ' + member.lastName
      } else {
        return 'Profile not found'
      }
    },
    openProfile (profileId) {
      this.$router.push({ name: 'profile', params: { id: profileId } })
    },
    removeMember (profileProject) {
      const confirmation = confirm('Are you sure?')
      if (confirmation) {
        this.removeProfileProject(profileProject)
          .then(() => {
            this.$toasted.global.rytmi_success({
              message: 'Member removed!'
            })
          }).catch(err => {
            this.$toasted.global.rytmi_error({
              message: err
            })
          })
      }
    },
    openEditModal (item) {
      this.editedProjectProfile = Object.assign({}, item.item)
      this.editedProjectProfile.startDate = new Date(this.editedProjectProfile.startDate)
      this.editedProjectProfile.endDate = new Date(this.editedProjectProfile.endDate)
      this.editedProjectProfile.index = item.index
      this.$refs.projectProfileEditModal.show()
    },
    closeEditModal () {
      this.$refs.projectProfileEditModal.hide()
    },
    callUpdateProfileProjectAction () {
      this.updateProfileProject(this.editedProjectProfile)
        .then((response) => {
          this.$toasted.global.rytmi_success({
            message: 'Member updated.'
          })
          this.$refs.projectProfileEditModal.hide()
        })
        .catch((err) => {
          this.$toasted.global.rytmi_error({
            message: err
          })
        })
    },
    getProfileProjectDescriptionByLanguage (language) {
      if (!this.editedProjectProfile.descriptions || !this.editedProjectProfile.descriptions.find(description => description.language === language)) {
        return {
          language,
          title: ''
        }
      }
      return this.editedProjectProfile.descriptions.find(description => description.language === language)
    }
  }
}
</script>
<style scoped>
button {
  width: 100%;
}
.modal-btn {
  margin-top: 1em;
}
.clickable {
  cursor: pointer;
}
</style>
