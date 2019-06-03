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
            slot-scope="{ close }"
          >
            <h4 class="modal-header-text">
              Edit user information
            </h4>
            <i
              class="fa fa-times fa-2x pull-right clickable"
              @click="close()"
            />
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
          <b-col class="col mb-1">
            <SkillRow
              v-for="skill in profileSkillsByProfileId(profile.id)"
              :key="skill.id"
              v-bind="skill"
            />
          </b-col>
        </b-row>
        <b-modal
          id="editProfileSkillsModal"
          hide-footer
        >
          <template
            slot="modal-header"
            slot-scope="{ close }"
          >
            <h5 class="modal-header-text">
              Edit skills
            </h5>
            <i
              class="fa fa-times fa-2x pull-right clickable"
              @click="close()"
            />
          </template>
          <EditSkills :profile-id="profile.id" />
          <b-btn
            class="pull-right"
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
          v-else
          :key="profileProject.id"
          :profile-project="profileProject"
        />
        <b-modal
          id="editProfileProjectsModal"
          hide-footer
          size="lg"
        >
          <template
            slot="modal-header"
            slot-scope="{ close }"
          >
            <h4 class="modal-header-text">
              Edit projects
            </h4>
            <i
              class="fa fa-times fa-2x pull-right clickable"
              @click="close()"
            />
          </template>
          <EditProjects :profile-id="profile.id" />
        </b-modal>
      </b-card>
      <b-card header="Utilization">
        <loading v-if="!profileProjects" />
        <UtilizationChart
          v-else
          :projects="profileProjects"
        />
      </b-card>
      <CvToolEducation :education-list="profile.education ? profile.education : []">
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
      </CvToolEducation>
      <b-modal
        id="editEducationModal"
        hide-footer
        size="lg"
      >
        <template
          slot="modal-header"
          slot-scope="{ close }"
        >
          <h4 class="modal-header-text">
            Edit education
          </h4>
          <i
            class="fa fa-times fa-2x pull-right clickable"
            @click="close()"
          />
        </template>
        <CvInfoEditEducation
          :profile="profile"
        />
      </b-modal>
      <b-card header="Employer history">
        <Employers :profile-id="profile.id" />
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex'
import proficiencyDesc from '@/assets/proficiencyDesc'
import UserProfileCard from './UserProfileCard.vue'
import EditBasicProfileInfo from '@/components/Profile/EditBasicProfileInfo'
import { ProjectRow, SkillRow, SkillExplanations, UtilizationChart } from '@/components/Common'
import { Employers, EditSkills, EditProjects } from '@/components/EditProfile'
import CvToolEducation from '@/components/Profile/CvToolEducation'
import CvInfoEditEducation from '@/components/EditProfile/CvInfoEditEducation'

export default {
  name: 'Profile',
  components: {
    ProjectRow,
    SkillRow,
    SkillExplanations,
    UtilizationChart,
    UserProfileCard,
    EditBasicProfileInfo,
    CvToolEducation,
    CvInfoEditEducation,
    Employers,
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
      'profileId'
    ]),
    knowDesc () {
      return proficiencyDesc.knows
    },
    wantDesc () {
      return proficiencyDesc.wants
    },
    profileProjects () {
      return this.profileProjectsByProfileId(this.profile.id)
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
