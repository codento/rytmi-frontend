<template>
  <form
    id="employers-form"
    class="animated fadeIn"
  >
    <b-row v-if="!shouldShowNewEmployerAddForm()">
      <b-col>
        <b-button
          class="pull-right mb-2"
          @click="addNewProfileEmployer"
        >
          <i class="fa fa-plus" />
          Add a new work history entry
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
              <EditProfileEmployer
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
        class="clickable"
        @mouseover="showEditIconByIndex = index"
        @mouseout="showEditIconByIndex = null"
      >
        <b-row @click="openOrCloseEmployerForEditing(profileEmployer)">
          <b-col cols="11">
            <WorkHistoryEntry
              :profile-employer="profileEmployer"
              :profile-id="profileId"
            />
          </b-col>
          <b-col
            v-show="showEditIconByIndex === index"
            cols="1"
          >
            <i class="fa fa-pencil pull-right" />
          </b-col>
        </b-row>
        <b-row v-if="selectedProfileEmployer && selectedProfileEmployer.id === profileEmployer.id">
          <b-col>
            <div>
              <EditProfileEmployer
                :key="profileEmployer ? profileEmployer.id : 0"
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
import { mapGetters } from 'vuex'
import { parse } from 'date-fns'
import { orderBy } from 'lodash'
import EditProfileEmployer from './EditProfileEmployer'
import WorkHistoryEntry from './WorkHistoryEntry'
import sortBy from 'lodash/sortBy'

export default {
  name: 'WorkHistoryEntryEditList',
  components: {
    EditProfileEmployer,
    WorkHistoryEntry
  },
  props: {
    profileId: Number
  },
  data () {
    return {
      selectedProfileEmployer: null,
      showEditIconByIndex: null
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
  methods: {
    addNewProfileEmployer () {
      this.selectedProfileEmployer = this.getEmptyProfileEmployer()
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
    },
    shouldShowNewEmployerAddForm () {
      return this.selectedProfileEmployer && this.selectedProfileEmployer.id === null
    },
    newProfileEmployerCreated (createdProfileEmployer) {
      console.log('newProfileEmployerCreated')
      console.log(createdProfileEmployer)
      console.log(this.profileEmployers)
      // const newlyCreatedProfileEmployer = this.profileEmployers.find(profileEmployer => profileEmployer.id === createdProfileEmployer.id)
      // this.openOrCloseEmployerForEditing(newlyCreatedProfileEmployer)
    }
  },
  watch: {
    profileEmployers () {
      console.log('watchi profileEmployers')
      console.log(this.profileEmployers)
    }
  }
}
</script>

<style scoped >
.clickable:hover {
  cursor: pointer;
}
</style>
