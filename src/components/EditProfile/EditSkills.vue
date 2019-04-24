<template>
  <div class="animated fadeIn">
    <h1>Proficiencies</h1>
    <hr>
    <b-row>
      <b-col class="col-12 col-md-7">
        <b-table
          :items="profileSkillsByProfileId(profileId)"
          :fields="fields"
          fixed
          caption-top
          stacked="sm"
        >
          <template slot="table-caption">
            Current proficiencies (click on value to update)
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
            <span @click.stop="showKnowsModal(knows)">
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
            <span @click.stop="showWantsModal(wantsTo)">
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
            <div @click="changeVisibilityInCV(visibleInCV)">
              <i
                class="fa"
                :class="visibleInCV.value ? 'fa-check-square' : 'fa-square'"
              />
            </div>
          </template>
          <template
            slot="remove"
            slot-scope="remove"
          >
            <b-btn
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
      <b-col class="col-12 col-md-5">
        <SkillForm :profile-id="profileId" />
      </b-col>
    </b-row>
    <b-modal
      ref="wantsToModal"
      title="Update skill willingness"
      hide-footer
    >
      <b-radio-group
        v-model="editedSkill.wantsTo"
        :options="wantsToOptions"
        plain
        stacked
      />
      <b-btn
        class="modal-btn"
        @click="updateSkill()"
      >
        Save
      </b-btn>
      <b-btn
        class="modal-btn"
        @click="hideModals()"
      >
        Cancel
      </b-btn>
    </b-modal>
    <b-modal
      ref="knowsModal"
      title="Update skill proficiency"
      hide-footer
    >
      <b-radio-group
        v-model="editedSkill.knows"
        :options="knowsOptions"
        plain
        stacked
      />
      <b-btn
        class="modal-btn"
        @click="updateSkill()"
      >
        Save
      </b-btn>
      <b-btn
        class="modal-btn"
        @click="hideModals()"
      >
        Cancel
      </b-btn>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import proficiencyDesc from '../../assets/proficiencyDesc'
import SkillForm from './SkillForm'

export default {
  name: 'EditSkills',
  components: {
    SkillForm
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
      knowsOptions: proficiencyDesc.knows,
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

</style>
