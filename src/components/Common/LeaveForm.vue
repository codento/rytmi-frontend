<template>
  <b-form
    id="leave-form"
    @submit.prevent="onSubmit"
  >
    <b-row>
      <b-col class="col-12 projects-table">
        <b-table
          v-if="absences"
          :items="absences"
          :fields="fields"
          caption-top
          stacked="sm"
          sort-by="startDate"
          primary-key="id"
        >
          <template slot="table-caption">
            <h4>Leaves</h4>
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
            slot="leaveId"
            slot-scope="data"
          >
            <span>
              {{ leaveById(data.value).description }}
            </span>
          </template>
          <template
            slot="edit"
            slot-scope="data"
          >
            <Edit2Icon
              class="clickable-icon"
              @click="editAbsence(data.item, data.toggleDetails)"
            />
          </template>
          <template
            slot="remove"
            slot-scope="data"
          >
            <Trash2Icon
              name="remove-member"
              class="clickable-icon"
              @click.once="remove(data.item)"
            />
          </template>
          <template
            slot="row-details"
            slot-scope="data"
          >
            <b-row>
              <b-col sm="6">
                <small for="leave-description-input">Leave type *</small>
                <b-form-group
                  invalid-feedback="Required"
                >
                  <v-select
                    v-model="absencesToEdit[data.item.id].leaveId"
                    :options="Object.values(leaveList)"
                    index="id"
                    label="description"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="6">
                <small>Start date</small>
                <Datepicker
                  v-model="absencesToEdit[data.item.id].startDate"
                  :name="`absence-table-start-date-${data.item.id}`"
                  :max-value="absencesToEdit[data.item.id].endDate"
                  :default-value="data.startDate"
                />
                <small
                  v-if="validated.edit[data.item.id] && !absencesToEdit[data.item.id].startDate"
                  class="text-danger"
                >
                  Start date is required
                </small>
              </b-col>
              <b-col cols="6">
                <small>End date</small>
                <Datepicker
                  v-model="absencesToEdit[data.item.id].endDate"
                  :name="`absence-table-end-date-${data.item.id}`"
                  :min-value="absencesToEdit[data.item.id].startDate"
                  :default-value="absencesToEdit[data.item.id].startDate"
                />
              </b-col>
              <b-col v-if="validated.edit[data.item.id] && !overlapsExistingAbsences(absencesToEdit[data.item.id], absences).overlaps">
                <small
                  class="text-danger"
                >
                  Leave may not overlap with other leaves
                </small>
              </b-col>
            </b-row>
            <b-button
              variant="primary"
              name="update-absence"
              class="mt-2"
              type="button"
              @click="updateAbsenceAndToggleEdit(absencesToEdit[data.item.id], data.toggleDetails)"
            >
              Update
            </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <h4>Add leave</h4>
    <b-row class="mt-4">
      <b-col sm="6">
        <small for="leave-description-input">Leave type *</small>
        <b-form-group
          invalid-feedback="Required"
        >
          <v-select
            v-if="leaveList"
            v-model="leave"
            :options="Object.values(leaveList)"
            :reduce="leave => leave.description"
            label="description"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row v-if="leave">
      <b-col>
        <small>Start date *</small>
        <Datepicker
          v-model="absence.startDate"
          name="absence-start-date"
          required
          :is-valid="inputStates.startDate"
        />
        <small
          v-if="!inputStates.startDate && inputStates.startDate !== undefined"
          class="text-danger"
        >
          Start date is required
        </small>
      </b-col>
    </b-row>
    <b-row v-if="leave">
      <b-col>
        <small>End date</small>
        <Datepicker
          v-model="absence.endDate"
          name="absence-end-date"
          :is-valid="inputStates.endDate"
          :min-value="absence.startDate"
          :default-value="absence.startDate"
        />
        <small
          v-if="!inputStates.endDate && inputStates.endDate !== undefined"
          class="text-danger"
        >
          End date should be after start date
        </small>
        <br v-if="validated.add && !overlapsExistingAbsences(absence, absences).overlaps && !inputStates.endDate">
        <small
          v-if="validated.add && !overlapsExistingAbsences(absence, absences).overlaps"
          class="text-danger"
        >
          Leave may not overlap with other leaves
        </small>
      </b-col>
    </b-row>
    <b-button
      variant="primary"
      name="submit"
      class="mt-2"
      type="submit"
      :disabled="!leave"
    >
      Add
    </b-button>
    <b-button
      variant="secondary"
      name="close"
      type="button"
      class="float-right"
      @click="closeModal"
    >
      Close
    </b-button>
  </b-form>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { Trash2Icon, Edit2Icon } from 'vue-feather-icons'
import { areRangesOverlapping } from 'date-fns'
import { cloneDeep } from 'lodash'
import vSelect from 'vue-select'
import Datepicker from '@/components/helpers/Datepicker'

export default {
  name: 'LeaveForm',
  components: {
    Datepicker,
    vSelect,
    Trash2Icon,
    Edit2Icon
  },
  props: {
    profile: Object
  },
  data () {
    return {
      validated: { add: false, edit: {} },
      leave: null,
      absence: { startDate: null, endDate: null },
      absences: [],
      absencesToEdit: {},
      fields: [
        { key: 'leaveId', label: 'Description' },
        { key: 'startDate', label: 'From' },
        { key: 'endDate', label: 'To' },
        { key: 'edit', label: '' },
        { key: 'remove', label: '' }
      ],
      profileToEdit: cloneDeep(this.profile),
      leaveList: {}
    }
  },
  computed: {
    ...mapGetters([
      'employerByName',
      'profileById',
      'leaves',
      'leaveById',
      'absencesByProfileId'
    ]),
    inputStates () {
      return {
        startDate: this.validated.add ? !!this.absence.startDate : undefined,
        endDate: this.validated.add ? !this.absence.endDate || this.absence.endDate >= this.absence.startDate : undefined,
        description: this.validated.add ? this.leave.description.length > 0 : undefined,
        overlaps: this.validated.add ? this.overlapsExistingAbsences(this.absence, this.absences).overlaps : undefined
      }
    },
    addLeaveFormIsValid () {
      const stateArray = []
      // Required always
      for (let entry of Object.entries(this.inputStates)) {
        stateArray.push(entry[1])
      }
      return stateArray.every(item => item)
    }
  },
  async created () {
    await this.fetchAbsencesForProfile(this.profile.id)
    this.absences = Object.values(this.absencesByProfileId(this.profile.id) || [])
    this.leaveList = cloneDeep(this.leaves)
  },
  methods: {
    ...mapActions([
      'removeAbsence',
      'addAbsenceForProfile',
      'updateProfile',
      'fetchProfiles',
      'fetchAbsencesForProfile',
      'updateAbsenceForProfile'
    ]),
    async onSubmit () {
      this.validated.add = true
      if (this.addLeaveFormIsValid) {
        try {
          this.validated.add = undefined
          this.absence.leaveId = this.leave.id
          await this.addAbsenceForProfile({ profileId: this.profile.id, data: this.absence })
          await this.fetchAbsencesForProfile(this.profile.id)
          this.absences = Object.values(this.absencesByProfileId(this.profile.id))
          this.$toasted.global.rytmi_success({
            message: 'Leave added.'
          })
          this.absence.startDate = null
          this.absence.endDate = null
        } catch (error) {
          this.$toasted.global.rytmi_error({
            message: `Could not add leave. ${error}`
          })
        }
      }
    },
    async remove (data) {
      try {
        await this.removeAbsence({ profileId: this.profile.id, id: data.id })
        this.absences = Object.values(this.absencesByProfileId(this.profile.id))
        this.$toasted.global.rytmi_success({
          message: 'Leave removed.'
        })
      } catch (error) {
        this.$toasted.global.rytmi_error({
          message: `Could not remove leave. ${error}`
        })
      }
    },
    closeModal () {
      this.$bvModal.hide('add-leave-modal')
    },
    editAbsence (data, toggleEdit) {
      if (!data._showDetails) {
        this.absencesToEdit = { ...this.absencesToEdit, [data.id]: { ...data } }
      } else {
        delete this.absencesToEdit[data.id]
      }
      toggleEdit()
    },
    async updateAbsenceAndToggleEdit (data, closeDetails) {
      this.$set(this.validated.edit, data.id, true)
      if (!!data.startDate && this.overlapsExistingAbsences(data, this.absences).overlaps) {
        try {
          await this.updateAbsenceForProfile(data)
          closeDetails()
          delete this.absencesToEdit[data.id]
          this.absences = Object.values(this.absencesByProfileId(this.profile.id))
          this.$set(this.validated.edit, data.id, false)
        } catch (error) {
          this.$toasted.global.rytmi_error({
            message: `Could not update leave. ${error}`
          })
        }
      }
    },
    overlapsExistingAbsences (date, absences) {
      const endDate = date.endDate || new Date(2099, 12, 31)
      const overlapMatches = []
      for (let absence of Object.values(absences)) {
        // do not match absence against itself
        if (date.id !== absence.id) {
          overlapMatches.push(!areRangesOverlapping(date.startDate, endDate.setHours(0, 0, 0, 0), absence.startDate.setHours(0, 0, 0, 0), absence.endDate.setHours(0, 0, 0, 0)))
        }
      }

      return {
        overlaps: overlapMatches.every(item => item)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/_variables.scss';

  .skill-item {
    float: left;
    padding: 5px 10px;
    background-color: $c-light;
    border-radius: 10px;
  }

  .skill-item.clickable:hover {
    background-color: darken($color: $c-light, $amount: 25);
    cursor: pointer;
  }

  .trash-icon {
    color: $c-violet-light;
  }

  .trash-icon:hover {
    color: $c-dark;
    cursor: pointer;
  }
</style>
