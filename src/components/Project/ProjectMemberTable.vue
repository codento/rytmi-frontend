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
          Consultants
        </template>
        <template
          slot="profileId"
          slot-scope="profileId"
        >
          <span
            name="open-profile"
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
          <span>
            {{ element.value | dateFilter }}
          </span>
        </template>
        <template
          slot="endDate"
          slot-scope="element"
        >
          <span>
            {{ element.value | dateFilter }}
          </span>
        </template>
        <template
          slot="workPercentage"
          slot-scope="element"
        >
          <span>
            {{ element.value }} %
          </span>
        </template>
        <template
          slot="edit"
          slot-scope="element"
        >
          <b-btn
            size="sm"
            class="mr-1"
            variant="success"
            @click.stop="openEditModal(element)"
          >
            Edit
          </b-btn>
        </template>        <template
          slot="remove"
          slot-scope="remove"
        >
          <b-btn
            name="remove-member"
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
      hide-header
      ok-only
      ok-title="Close"
      ok-variant="light"
    >
      <h3>{{ printMember(selectedProfileProject.profileId) }}</h3>
      <ProjectProfileForm
        :profile-project="selectedProfileProject"
        hide-project-select
        hide-profile-select
        no-redirect
        @profile-project-created-or-updated="closeEditModal()"
      />
    </b-modal>
  </div>
</template>
<script>
import { ProjectProfileForm } from '@/components/Common'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProjectMemberTable',
  components: {
    ProjectProfileForm
  },
  props: {
    members: Array
  },
  data () {
    return {
      selectedProfileProject: {
        role: { fi: '', en: '' }
      }
    }
  },
  computed: {
    ...mapGetters(['profileById', 'currentLanguage', 'isAdmin']),
    fields () {
      return [
        { key: 'profileId', label: 'Name' },
        { key: `role.${this.currentLanguage}`, label: 'Role' },
        { key: 'startDate', label: 'From' },
        { key: 'endDate', label: 'To' },
        { key: 'workPercentage', label: 'Utilization' },
        this.isAdmin ? 'edit' : null,
        this.isAdmin ? 'remove' : null
      ]
    }
  },
  methods: {
    ...mapActions(['removeProfileProject']),
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
      this.selectedProfileProject = Object.assign({}, item.item)
      this.selectedProfileProject.startDate = new Date(this.selectedProfileProject.startDate)
      this.selectedProfileProject.endDate = this.selectedProfileProject.endDate ? new Date(this.selectedProfileProject.endDate) : null
      this.selectedProfileProject.index = item.index
      this.$refs.projectProfileEditModal.show()
    },
    closeEditModal () {
      this.$refs.projectProfileEditModal.hide()
    }
  }
}
</script>
<style scoped>
.clickable {
  cursor: pointer;
}
.clickable:hover {
  font-weight: bolder;
}
</style>
