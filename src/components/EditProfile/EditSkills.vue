<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col
        cols="12"
        lg="5"
        class="mt-4 mx-4"
      >
        <SkillForm :profile-id="profileId" />
      </b-col>
      <b-col>
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
            {{ skillById(skillId.value).name[currentLanguage] }}
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
                variant="c-violet-light"
              />
            </span>
          </template>
          <template
            slot="wantsTo"
            slot-scope="wantsTo"
          >
            <span
              v-show="!isLanguageSkill(wantsTo.item.skillId)"
              class="clickable"
              @click.stop="showWantsModal(wantsTo)"
            >
              <b-progress
                :value="wantsTo.value"
                :max="5"
                height="1.7rem"
                show-value
                variant="c-violet-light"
              />
            </span>
          </template>
          <template
            slot="remove"
            slot-scope="remove"
          >
            <Trash2Icon
              :id="'remove-skill-' + remove.index"
              class="clickable-icon float-right mr-2"
              @click.stop="removeSkillFromProfile(remove.item.id)"
            />
          </template>
        </b-table>
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
import proficiencyDesc from '@/assets/proficiencyDesc'
import SkillForm from './SkillForm'
import EditSkillsLevelSelect from '@/components/EditProfile/EditSkillsLevelSelect'
import { Trash2Icon } from 'vue-feather-icons'
import { LANGUAGE_ENUM } from '@/utils/constants'

export default {
  name: 'EditSkills',
  components: {
    SkillForm,
    EditSkillsLevelSelect,
    Trash2Icon
  },
  props: {
    profileId: Number
  },
  data () {
    return {
      fields: [
        { key: 'skillId', label: 'Proficiency' },
        { key: 'knows', label: 'Level' },
        { key: 'wantsTo', label: 'Willingness' },
        { key: 'remove', label: '' }
      ],
      wantsToOptions: proficiencyDesc.wants,
      editedSkill: {}
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillById',
      'profileSkillsByProfileId',
      'skillGroupBySkillId',
      'currentLanguage'
    ]),
    currentSkillIsLanguage () {
      if (this.editedSkill && this.editedSkill.skillId) {
        return this.isLanguageSkill(this.editedSkill.skillId)
      }
      return false
    },
    knowsOptions () {
      if (this.currentSkillIsLanguage) {
        return proficiencyDesc.knowsLanguage['en']
      }
      return proficiencyDesc.knows['en']
    }
  },
  methods: {
    ...mapActions([
      'removeProfileSkill',
      'updateProfileSkill'
    ]),
    isLanguageSkill (skillId) {
      const skillGroup = this.skillGroupBySkillId(skillId)
      return skillGroup ? skillGroup.title.en === LANGUAGE_ENUM.LANGUAGE_GROUP_NAME : false
    },
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
    knowsOptionSelected (newValue) {
      this.editedSkill.knows = newValue
    },
    wantsToOptionSelected (newValue) {
      this.editedSkill.wantsTo = newValue
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.clickable-icon {
  cursor: pointer;
  color: darken($color: $c-light, $amount: 40);
}
.clickable-icon:hover {
  color: darken($color: $c-light, $amount: 80);
}
.modal-btn {
  margin-top: 0.5rem;
}
.clickable {
  cursor: pointer;
}
</style>
