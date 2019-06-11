<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col class="col-12">
        <b-table
          :items="profileSkillsByProfileId(profileId)"
          :fields="fields"
          fixed
          caption-top
          stacked="sm"
        >
          <template slot="table-caption">
            Click on value to update
          </template>
          <template
            slot="skillId"
            slot-scope="skillId"
          >
            {{ skillById(skillId.value).name }}
          </template>
          <template
            slot="knows"
            slot-scope="knows"
          >
            <span
              class="clickable"
              @click.stop="showKnowsModal(knows)"
            >
              <b-progress
                :value="knows.value"
                :max="5"
                height="1.7rem"
                show-value
              />
            </span>
          </template>
          <template
            slot="wantsTo"
            slot-scope="wantsTo"
          >
            <span
              class="clickable"
              @click.stop="showWantsModal(wantsTo)"
            >
              <b-progress
                :value="wantsTo.value"
                :max="5"
                height="1.7rem"
                show-value
              />
            </span>
          </template>
          <template
            slot="visibleInCV"
            slot-scope="visibleInCV"
          >
            <div
              :id="`visible-in-cv-checkbox-container-${visibleInCV.item.id}`"
              @click="changeVisibilityInCV(visibleInCV)"
            >
              <i
                class="fa clickable"
                :class="visibleInCV.value ? 'fa-check-square' : 'fa-square'"
              />
            </div>
          </template>
          <template
            slot="remove"
            slot-scope="remove"
          >
            <b-btn
              name="remove-skill"
              size="sm"
              class="mr-1"
              variant="danger"
              @click.stop="removeSkillFromProfile(remove.item.id)"
            >
              Remove
            </b-btn>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="col-12">
        <SkillForm :profile-id="profileId" />
      </b-col>
    </b-row>
    <b-modal
      ref="wantsToModal"
      title="Update skill willingness"
      hide-footer
    >
      <EditSkillsLevelSelect
        :options="wantsToOptions"
        :initial-value="editedSkill.wantsTo"
        @option-selected="wantsToOptionSelected($event)"
      />
      <b-btn
        class="modal-btn"
        @click="updateSkill()"
      >
        Save
      </b-btn>
      <b-btn
        class="modal-btn"
        variant="light"
        @click="hideModals()"
      >
        Close
      </b-btn>
    </b-modal>
    <b-modal
      ref="knowsModal"
      title="Update skill proficiency"
      hide-footer
    >
      <EditSkillsLevelSelect
        :options="knowsOptions"
        :initial-value="editedSkill.knows"
        @option-selected="knowsOptionSelected($event)"
      />
      <b-btn
        class="modal-btn"
        @click="updateSkill()"
      >
        Save
      </b-btn>
      <b-btn
        class="modal-btn"
        variant="light"
        @click="hideModals()"
      >
        Close
      </b-btn>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import proficiencyDesc from '../../assets/proficiencyDesc'
import SkillForm from './SkillForm'
import EditSkillsLevelSelect from '@/components/EditProfile/EditSkillsLevelSelect'

export default {
  name: 'EditSkills',
  components: {
    SkillForm,
    EditSkillsLevelSelect
  },
  props: {
    'profileId': Number
  },
  data () {
    return {
      fields: [
        { key: 'skillId', label: 'Proficiency' },
        { key: 'knows', label: 'Level' },
        { key: 'wantsTo', label: 'Willingness' },
        { key: 'visibleInCV', label: 'Show in CV' },
        { key: 'remove', label: ' ' }
      ],
      wantsToOptions: proficiencyDesc.wants,
      knowsOptions: proficiencyDesc.knows['en'],
      editedSkill: {}
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillById',
      'profileSkillsByProfileId'
    ])
  },
  methods: {
    ...mapActions([
      'removeProfileSkill',
      'updateProfileSkill'
    ]),
    removeSkillFromProfile (skillId) {
      const confirmation = confirm('Are you sure?')
      if (confirmation) {
        this.removeProfileSkill({ profileId: this.profileId, id: skillId })
      }
    },
    showWantsModal (el) {
      this.editedSkill = Object.assign({}, el.item)
      this.$refs.wantsToModal.show()
    },
    showKnowsModal (el) {
      this.editedSkill = Object.assign({}, el.item)
      this.$refs.knowsModal.show()
    },
    hideModals () {
      this.$refs.knowsModal.hide()
      this.$refs.wantsToModal.hide()
    },
    updateSkill () {
      this.updateProfileSkill(this.editedSkill)
        .then(response => {
          this.$toasted.global.rytmi_success({
            message: 'User\'s skill updated.'
          })
          this.$refs.wantsToModal.hide()
          this.$refs.knowsModal.hide()
        })
    },
    changeVisibilityInCV (visibleInCV) {
      const skillToEdit = { ...visibleInCV.item }
      skillToEdit.visibleInCV = !skillToEdit.visibleInCV
      this.editedSkill = skillToEdit
      this.updateSkill()
    },
    knowsOptionSelected (newValue) {
      this.editedSkill.knows = newValue
    },
    wantsToOptionSelected (newValue) {
      this.editedSkill.wantsTo = newValue
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
</style>
