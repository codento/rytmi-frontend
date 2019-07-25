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
          <Edit2Icon
            v-show="isAdmin || element.item.profileId === profileId"
            class="clickable-icon"
            @click.prevent="openEditModal(element)"
          />
        </template>
        <template
          slot="remove"
          slot-scope="element"
        >
          <Trash2Icon
            v-show="isAdmin || element.item.profileId === profileId"
            :id="'remove-project-member-' + element.index"
            class="clickable-icon"
            @click.stop="removeMember(element.item)"
          />
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
import { Edit2Icon, Trash2Icon } from 'vue-feather-icons'

export default {
  name: 'ProjectMemberTable',
  components: {
    ProjectProfileForm,
    Edit2Icon,
    Trash2Icon
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
    ...mapGetters(['profileById', 'currentLanguage', 'isAdmin', 'profileId']),
    fields () {
      return [
        { key: 'profileId', label: 'Name' },
        { key: `role.${this.currentLanguage}`, label: 'Role' },
        { key: 'startDate', label: 'From' },
        { key: 'endDate', label: 'To' },
        { key: 'workPercentage', label: 'Utilization' },
        { key: 'edit', label: '' },
        { key: 'remove', label: '' }
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
<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.clickable {
  cursor: pointer;
}
.clickable:hover {
  text-shadow: 0px 0px 1px $color-text;
}
.clickable-icon {
  cursor: pointer;
  color: darken($color: $c-light, $amount: 40);
}
.clickable-icon:hover {
  color: darken($color: $c-light, $amount: 80);
}
</style>
