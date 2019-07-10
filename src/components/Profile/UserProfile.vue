<template>
  <b-row>
    <b-col cols="12">
      <b-card id="user-profile">
        <div
          slot="header"
          class="mb-0"
        >
          Profile
          <span
            v-if="profileId === profile.id || isAdmin"
            v-b-modal.editProfileBasicInfoModal
            class="pull-right"
          >
            <i class="fa fa-pencil clickable" />
          </span>
        </div>
        <UserProfileCard :profile="profile" />
        <b-modal
          id="editProfileBasicInfoModal"
          hide-footer
        >
          <template
            slot="modal-header"
          >
            <h4 class="modal-header-text">
              Edit user information
            </h4>
          </template>
          <EditBasicProfileInfo
            :profile="profile"
          />
        </b-modal>
      </b-card>
    </b-col>
    <b-col cols="12">
      <b-card id="Skills">
        <div
          slot="header"
          class="mb-0"
        >
          Skills
          <span
            v-if="profileId === profile.id || isAdmin"
            v-b-modal.editProfileSkillsModal
            class="pull-right"
          >
            <i class="fa fa-pencil clickable" />
          </span>
        </div>
        <b-row v-if="showInfo">
          <SkillExplanations
            :know-desc="knowDesc"
            :want-desc="wantDesc"
          />
        </b-row>
        <b-row v-else>
          <b-col
            v-if="profileSkillsByProfileId(profile.id).length > 0"
            class="col mb-1"
          >
            <SkillRow
              v-for="skill in profileSkillsByProfileId(profile.id)"
              :key="skill.id"
              v-bind="skill"
            />
          </b-col>
          <b-col
            v-else
            class="text-muted"
          >
            No skills added
          </b-col>
        </b-row>
        <b-modal
          id="editProfileSkillsModal"
          hide-footer
        >
          <template
            slot="modal-header"
          >
            <h5 class="modal-header-text">
              Edit skills
            </h5>
          </template>
          <EditSkills :profile-id="profile.id" />
          <b-btn
            class="pull-right"
            variant="light"
            @click="$bvModal.hide('editProfileSkillsModal')"
          >
            Close
          </b-btn>
        </b-modal>
      </b-card>
      <b-card header="Projects">
        <div slot="header">
          Projects
          <span
            v-if="profileId === profile.id || isAdmin"
            v-b-modal.editProfileProjectsModal
            class="pull-right"
          >
            <i class="fa fa-pencil clickable" />
          </span>
        </div>
        <loading v-if="!profileProjects" />
        <ProjectRow
          v-for="profileProject in profileProjects"
          v-else-if="profileProjects.length > 0"
          :key="profileProject.id"
          :profile-project="profileProject"
        />
        <div
          v-else
          class="text-muted"
        >
          No projects joined
        </div>
        <b-modal
          id="editProfileProjectsModal"
          ok-only
          ok-title="Close"
          ok-variant="light"
          size="lg"
        >
          <template
            slot="modal-header"
          >
            <h4 class="modal-header-text">
              Edit projects
            </h4>
          </template>
          <EditProjects :profile-id="profile.id" />
        </b-modal>
      </b-card>
      <CvToolEducation
        :education-list="profile.education ? profile.education : []"
        :certificate-list="profile.expertiseValidations ? profile.expertiseValidations : []"
      >
        <template #custom-header>
          Education
          <span
            v-if="profileId === profile.id || isAdmin"
            v-b-modal.editEducationModal
            class="pull-right"
          >
            <i class="fa fa-pencil clickable" />
          </span>
        </template>
        <template
          v-if="!profile.education || profile.education.length === 0"
          #custom-content
        >
          <div class="text-muted">
            No education added
          </div>
        </template>
      </CvToolEducation>
      <b-modal
        id="editEducationModal"
        ok-only
        ok-title="Close"
        ok-variant="light"
        size="lg"
      >
        <template
          slot="modal-header"
        >
          <h4 class="modal-header-text">
            Edit education
          </h4>
        </template>
        <EditEducation
          :profile="profile"
        />
      </b-modal>
      <b-card header="Employer history">
        <div slot="header">
          Employer history
          <span
            v-if="profileId === profile.id || isAdmin"
            v-b-modal="'work-history'"
            class="pull-right"
          >
            <i class="fa fa-pencil clickable" />
          </span>
        </div>
        <WorkHistoryList :profile-id="profile.id" />
      </b-card>
      <b-modal
        id="work-history"
        size="lg"
        ok-only
        ok-title="Close"
        ok-variant="light"
      >
        <template
          slot="modal-header"
        >
          <h4 class="modal-header-text">
            Edit work history
          </h4>
        </template>
        <EditWorkHistory
          :profile-id="profile.id"
        />
      </b-modal>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex'
import proficiencyDesc from '@/assets/proficiencyDesc'
import UserProfileCard from './UserProfileCard.vue'
import EditBasicProfileInfo from '@/components/Profile/EditBasicProfileInfo'
import { ProjectRow, SkillRow, SkillExplanations } from '@/components/Common'
import { EditWorkHistory, WorkHistoryList, EditSkills, EditProjects } from '@/components/EditProfile'
import CvToolEducation from '@/components/Profile/CvToolEducation'
import EditEducation from '@/components/EditProfile/EditEducation'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

export default {
  name: 'UserProfile',
  components: {
    ProjectRow,
    SkillRow,
    SkillExplanations,
    UserProfileCard,
    EditBasicProfileInfo,
    CvToolEducation,
    EditEducation,
    EditWorkHistory,
    WorkHistoryList,
    EditSkills,
    EditProjects
  },
  props: {
    profile: Object
  },
  data () {
    return {
      showInfo: false
    }
  },
  computed: {
    ...mapGetters([
      'skillById',
      'profileSkillsByProfileId',
      'profileProjectsByProfileId',
      'isAdmin',
      'profileId',
      'projectById',
      'employerByName'
    ]),
    knowDesc () {
      return proficiencyDesc.knows['en']
    },
    wantDesc () {
      return proficiencyDesc.wants
    },
    internalCompanyId () {
      return this.employerByName(INTERNAL_COMPANY_NAME).id
    },
    profileProjects () {
      return this.profileProjectsByProfileId(this.profile.id)
        .filter(profileProject => {
          const employerId = this.projectById(profileProject.projectId).employerId
          return employerId === this.internalCompanyId
        })
    }
  },
  methods: {
    getSkills () {
      return this.profileSkillsByProfileId(this.profile.userId)
    },
    sortSkills (param) {
      return this.$lodash.orderBy(this.skills, ['wantsTo', 'name'], ['desc', 'asc'])
    },
    skillName (skillId) {
      return this.skillById(skillId).name
    },
    showExplanations (show) {
      this.showInfo = show
    }
  }
}
</script>
<style scoped>
.modal-header-text {
  margin-bottom: 0;
}
.clickable:hover {
  cursor: pointer;
}
</style>
