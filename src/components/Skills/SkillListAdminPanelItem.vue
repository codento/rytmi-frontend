<template>
  <div>
    <b-row align-v="center">
      <b-col>
        <h4>
          <slot name="group-title">
            Edit items
          </slot>
        </h4>
      </b-col>
      <b-col cols="3">
        <b-button
          :id="'add-new-' + idPrefix + '-btn'"
          type="submit"
          variant="success"
          class="float-right mb-2"
          @click.prevent="startCreateMode()"
        >
          Add
        </b-button>
      </b-col>
    </b-row>
    <b-list-group :id="idPrefix + '-items'">
      <b-list-group-item
        v-for="(item, index) in listItems.filter(item => item.id !== null || showCreateNewForm)"
        :key="idPrefix + '-' + item.id"
        class="clickable"
        @click="startEditMode(item)"
        @mouseover="showEditIconByIndex = index"
        @mouseout="showEditIconByIndex = null"
      >
        <b-row
          v-if="item.id === null"
        >
          <b-col><h5>Add a new {{ label.toLowerCase() }}</h5></b-col>
        </b-row>
        <b-row v-if="item.id === editedId && !item.disabled">
          <b-col
            v-for="lang of languages"
            :key="lang"
            cols="12"
          >
            <small :for="'edit-' + idPrefix + '-name'">{{ label }} name ({{ lang }})</small>
            <b-input
              :id="'edit-' + idPrefix + '-name'"
              v-model="editedName[lang]"
              type="text"
              :state="inputState.editedName.state[lang]"
              :disabled="lang === 'en' && (editedName[lang] === 'Language' || editedName[lang] === 'Uncategorized')"
              @focus="showFeedback = true"
            />
            <b-form-invalid-feedback :state="inputState.editedName.state[lang]">
              {{ inputState.editedName.feedback }}
            </b-form-invalid-feedback>
          </b-col>
          <b-col
            v-if="isSkillCategory"
            cols="12"
          >
            <small for="select-skill-group">Skill group</small>
            <b-select
              id="select-skill-group"
              v-model="selectedSkillGroupId"
              :options="dropdownOptions"
              required
              :state="inputState.groupId.state"
              :disabled="editedName['en'] === 'Language' || editedName['en'] === 'Uncategorized'"
              @change="showFeedback = true"
            />
          </b-col>
          <b-col cols="12">
            <small
              v-if="showFeedback && !inputState.groupId.state"
              class="text-danger"
            >
              {{ inputState.groupId.feedback }}
            </small>
          </b-col>
          <b-col cols="12">
            <b-button
              :id="'save-' + idPrefix + '-edits-btn'"
              type="submit"
              variant="success"
              class="mt-2"
              :disabled="!inputState.editedName.isValid() || !inputState.groupId.state"
              @click.prevent="saveEdits(item)"
            >
              {{ item.id !== null ? 'Save edits' : 'Submit' }}
            </b-button>
            <b-button
              :id="'cancel-' + idPrefix + '-edits-btn'"
              type="button"
              variant="light"
              class="mt-2 ml-2"
              @click.stop="resetEditedItem()"
            >
              Cancel
            </b-button>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col>
            <span :class="item.disabled ? 'text-muted' : ''">
              {{ item.title[currentLanguage] }}
            </span>
            <b-badge
              v-if="editedId === null && lastUpdatedName === item.title"
              pill
              variant="success"
            >
              {{ lastUpdatedLabel }}
            </b-badge>
          </b-col>
          <b-col
            v-show="showEditIconByIndex === index && !item.disabled"
            cols="1"
          >
            <EditIcon
              size="1x"
              class="pull-left"
            />
          </b-col>
          <b-col
            v-show="item.disabled"
            cols="1"
          >
            <LockIcon
              size="1x"
              class="pull-left text-muted"
            />
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
    <b-row
      v-if="errorDetails.length > 0"
      class="mt-3 text-danger"
    >
      <ApiErrorDetailsPanel :error-details="errorDetails" />
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { kebabCase } from 'lodash'
import { EditIcon, LockIcon } from 'vue-feather-icons'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel.vue'

export default {
  name: 'SkillListAdminPanelItem',
  components: {
    ApiErrorDetailsPanel,
    EditIcon,
    LockIcon
  },
  props: {
    isSkillCategory: {
      type: Boolean,
      default: false
    },
    listItems: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: true,
      default: 'item'
    },
    updateAction: {
      type: Function,
      required: true
    },
    createAction: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      editedId: null,
      editedName: { fi: '', en: '' },
      selectedSkillGroupId: null,
      showFeedback: false,
      showCreateNewForm: false,
      showEditIconByIndex: null,
      lastUpdatedName: null,
      lastUpdatedLabel: null,
      errorDetails: [],
      languages: ['fi', 'en']
    }
  },
  computed: {
    ...mapGetters(['skillGroups', 'currentLanguage', 'isAdmin']),
    idPrefix () {
      return kebabCase(this.label)
    },
    dropdownOptions () {
      return Object.values(this.skillGroups).map(group => {
        return { value: group.id, text: group.title[this.currentLanguage] }
      }).sort((a, b) => a.text.localeCompare(b.text))
    },
    inputState () {
      const nameState = {
        editedName: {
          state: {
            en: this.showFeedback ? this.editedName.en.length > 0 : null,
            fi: this.showFeedback ? this.editedName.fi.length > 0 : null
          },
          feedback: 'Can\'t be empty',
          isValid: function () { return Object.entries(this.state).reduce(([accKey, accValue], [key, value]) => accValue && value) }
        }
      }
      if (this.isSkillCategory) {
        return { ...nameState,
          groupId: {
            state: this.showFeedback ? this.selectedSkillGroupId !== null : null,
            feedback: 'Can\'t be empty'
          }
        }
      } else {
        return { ...nameState, groupId: { state: true, feedback: null } }
      }
    }
  },
  methods: {
    resetEditedItem () {
      this.showEditIconByIndex = null
      this.editedId = null
      this.editedName = { fi: '', en: '' }
      this.selectedSkillGroupId = null
      this.showFeedback = false
      this.showCreateNewForm = false
    },
    startCreateMode () {
      this.resetEditedItem()
      this.showCreateNewForm = true
    },
    startEditMode (item) {
      if (this.editedId !== item.id) {
        this.resetEditedItem()
        this.lastUpdatedName = null
        this.editedId = item.id
        this.editedName = item.id === null ? '' : { ...item.title }
        // Only categories have skillGroupId
        if (this.isSkillCategory) {
          // Select no group for new item
          this.selectedSkillGroupId = item.skillGroupId >= 0 ? item.skillGroupId : null
        }
      }
    },
    async saveEdits (item) {
      this.errorDetails = []
      const isNewItem = item.id === null
      const newValues = {
        title: this.editedName,
        skillGroupId: this.selectedSkillGroupId
      }
      try {
        if (isNewItem) {
          await this.createAction(newValues)
        } else {
          newValues.id = item.id
          await this.updateAction(newValues)
        }
        this.$toasted.global.rytmi_success({
          message: isNewItem ? `${this.label} ${this.editedName} added` : `${this.label} updated`
        })
        this.lastUpdatedName = this.editedName
        this.lastUpdatedLabel = isNewItem ? 'New' : 'Updated'
        this.resetEditedItem()
      } catch (error) {
        if (error.response) {
          if (Array.isArray(error.response.data.error.details)) {
            this.errorDetails = error.response.data.error.details
          } else {
            this.errorDetails.push(error.response.data.error.details)
          }
        } else {
          this.errorDetails.push(error.message)
        }
        this.$toasted.global.rytmi_error({
          message: isNewItem ? `Error adding ${this.label.toLowerCase()}: \n ${this.errorDetails}` : `Error updating ${this.label.toLowerCase()}: \n ${this.errorDetails}`
        })
      }
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
.clickable:hover {
  background-color: rgb(245, 245, 245);
}
</style>
