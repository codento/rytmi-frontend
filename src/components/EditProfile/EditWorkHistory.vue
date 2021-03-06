<template>
  <form
    id="employers-form"
    class="animated fadeIn"
  >
    <b-row>
      <b-col>
        <b-button
          class="float-right mb-2"
          variant="primary"
          @click="addNewProfileEmployer"
        >
          Add a new item
        </b-button>
      </b-col>
    </b-row>
    <b-list-group>
      <b-list-group-item
        v-if="shouldShowNewEmployerAddForm()"
        class="clickable"
      >
        <b-row>
          <b-col>
            Add a new employer history entry
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div>
              <EditEmployer
                :profile-employer="selectedProfileEmployer"
                :vue-selects-employers="vueSelectsEmployers"
                @new-profile-employer-created="newProfileEmployerCreated($event)"
              />
            </div>
          </b-col>
        </b-row>
      </b-list-group-item>
      <b-list-group-item
        v-for="(profileEmployer, index) in profileEmployers"
        :key="profileEmployer.id"
        :class="isHoveredProfileEmployerCardSelected(profileEmployer.id) ? '' : 'clickable'"
        @mouseover="showEdit2IconByIndex = index"
        @mouseout="showEdit2IconByIndex = null"
      >
        <b-row
          class="work-history-list-titlebar"
          @click="openOrCloseEmployerForEditing(profileEmployer)"
        >
          <b-col cols="11">
            <WorkHistoryListItem
              :profile-employer="profileEmployer"
              :profile-id="profileId"
            />
          </b-col>
          <b-col
            v-show="showEdit2IconByIndex === index && !isHoveredProfileEmployerCardSelected(profileEmployer.id)"
            cols="1"
          >
            <Edit2Icon size="1x" />
          </b-col>
        </b-row>
        <b-row v-if="selectedProfileEmployer && selectedProfileEmployer.id === profileEmployer.id">
          <b-col>
            <div>
              <EditEmployer
                :key="profileEmployer ? profileEmployer.id : 0"
                class="edit-employer"
                :profile-employer="profileEmployer"
                :vue-selects-employers="vueSelectsEmployers"
              />
            </div>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { parse } from 'date-fns'
import { orderBy } from 'lodash'
import EditEmployer from './EditEmployer'
import WorkHistoryListItem from './WorkHistoryListItem'
import sortBy from 'lodash/sortBy'
import { Edit2Icon } from 'vue-feather-icons'

export default {
  name: 'EditWorkHistory',
  components: {
    EditEmployer,
    WorkHistoryListItem,
    Edit2Icon
  },
  props: {
    profileId: Number
  },
  data () {
    return {
      selectedProfileEmployer: null,
      showEdit2IconByIndex: null,
      profileEmployerIdToOpenForEditing: null
    }
  },
  computed: {
    ...mapGetters([
      'profileEmployersByProfileId',
      'employers'
    ]),
    profileEmployers () {
      const employers = this.profileEmployersByProfileId(this.profileId).map(employer => ({
        ...employer,
        startDate: employer.startDate ? parse(employer.startDate) : null,
        endDate: employer.endDate ? parse(employer.endDate) : null
      }))
      return orderBy(employers, ['startDate'], ['desc'])
    },
    vueSelectsEmployers () {
      return sortBy(Object.values(this.employers).map(employer => ({
        label: employer.name,
        id: employer.id
      })),
      ['label'])
    }
  },
  watch: {
    profileEmployers () {
      if (this.profileEmployerIdToOpenForEditing) {
        const newlyCreatedProfileEmployer = this.profileEmployers.find(profileEmployer => profileEmployer.id === this.profileEmployerIdToOpenForEditing)
        this.openOrCloseEmployerForEditing(newlyCreatedProfileEmployer)
        this.profileEmployerIdToOpenForEditing = null
      }
    }
  },
  methods: {
    ...mapActions(['fetchEmployers']),
    loadData: function () {
      this.fetchEmployers()
    },
    addNewProfileEmployer () {
      this.selectedProfileEmployer = this.getEmptyProfileEmployer()
      this.loadData()
    },
    getEmptyProfileEmployer () {
      return {
        id: null,
        profileId: this.profileId,
        employerId: null,
        description: {
          fi: '',
          en: ''
        },
        title: {
          fi: '',
          en: ''
        },
        startDate: null,
        endDate: null
      }
    },
    openOrCloseEmployerForEditing (profileEmployer) {
      this.selectedProfileEmployer = this.selectedProfileEmployer && this.selectedProfileEmployer.id === profileEmployer.id ? null : profileEmployer
      this.loadData()
    },
    shouldShowNewEmployerAddForm () {
      return this.selectedProfileEmployer && this.selectedProfileEmployer.id === null
    },
    newProfileEmployerCreated (createdProfileEmployer) {
      this.profileEmployerIdToOpenForEditing = createdProfileEmployer.id
    },
    isHoveredProfileEmployerCardSelected (profileEmployerId) {
      return this.selectedProfileEmployer ? this.selectedProfileEmployer.id === profileEmployerId : false
    }
  }
}
</script>

<style scoped >
.clickable:hover {
  cursor: pointer;
}
.edit-employer {
  margin-left: 10px;
  margin-right: 10px;
}
.work-history-list-titlebar {
  margin-bottom: 5px;
}
</style>
