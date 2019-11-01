<template>
  <b-row>
    <b-col cols="12">
      <b-card
        id="user-profile"
        class="mb-2"
      >
        <div
          slot="header"
          class="mb-0"
        >
          Profile
          <Edit2Icon
            v-if="profileId === profile.id || isAdmin"
            v-b-modal.editProfileBasicInfoModal
            size="1x"
            class="clickable float-right"
          />
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
      <b-card
        id="Skills"
        class="mb-2"
      >
        <div
          slot="header"
          class="mb-0"
        >
          Skills
          <Edit2Icon
            v-if="profileId === profile.id || isAdmin"
            v-b-modal.editProfileSkillsModal
            size="1x"
            class="clickable float-right"
          />
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
              disable-tooltip
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
          size="xl"
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
          <hr>
          <b-btn
            class="float-left my-2 mx-2"
            variant="light"
            @click="$bvModal.hide('editProfileSkillsModal')"
          >
            Close
          </b-btn>
        </b-modal>
      </b-card>
      <b-card
        header="Projects"
        class="mb-2"
      >
        <div slot="header">
          Projects
          <Edit2Icon
            v-if="profileId === profile.id || isAdmin"
            v-b-modal.editProfileProjectsModal
            size="1x"
            class="clickable float-right"
          />
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
        <small><span class="confidential">* </span>Confidential project</small>
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
        :certificate-or-other-list="profile.certificatesAndOthers ? profile.certificatesAndOthers : []"
      >
        <template #custom-header>
          <div slot="header">
            Education
            <Edit2Icon
              v-if="profileId === profile.id || isAdmin"
              v-b-modal.editEducationModal
              size="1x"
              class="clickable float-right"
            />
          </div>
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
          <Edit2Icon
            v-if="profileId === profile.id || isAdmin"
            v-b-modal="'work-history'"
            size="1x"
            class="clickable float-right"
          />
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
import { Edit2Icon } from 'vue-feather-icons'

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
    EditProjects,
    Edit2Icon
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
        }).sort((a, b) => {
          if (a.startDate < b.startDate) { return 1 }
          if (a.startDate > b.startDate) { return -1 }
          return 0
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
.confidential {
  color: red;
}
</style>
