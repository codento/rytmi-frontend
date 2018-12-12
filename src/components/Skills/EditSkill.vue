<template>
  <div>
    <loading-spinner v-if="loading" />
    <div v-else>
      <h2>
        Edit skill
        <button
          type="button"
          class="close"
          @click="close"
        >
          X
        </button>
      </h2>
      <hr>
      <b-form @submit="submit">
        <b-form-group label="Name:">
          <b-form-input
            id="skillName"
            v-model="name"
            type="text"
            required
          />
        </b-form-group>
        <b-form-group
          label="Skill category:"
        >
          <v-select
            v-model="selectedSkillCategory"
            :options="skillCategoryOptions"
            label="title"
            required
          />
          <div class="text-danger">{{ categoryRequired }}</div>
        </b-form-group>
        <b-form-group label="Description:">
          <b-form-textarea
            v-model="description"
            :rows="4"
            placeholder="Enter description"
          />
        </b-form-group>
        <b-form-row v-if="!deleteDialogOpen">
          <b-col
            md="2"
            cols="3"
          >
            <b-button @click="close">
              Cancel
            </b-button>
          </b-col>
          <b-col
            md="2"
            cols="3"
            offset="3"
            offset-md="6"
          >
            <b-button
              id="delete-dialog-btn"
              variant="danger"
              @click="openDeleteConfirmation"
            >
              Delete
            </b-button>
          </b-col>
          <b-col
            md="2"
            cols="3"
          >
            <b-button
              type="submit"
              variant="success"
            >
              Submit
            </b-button>
          </b-col>
        </b-form-row>
      </b-form>
      <div
        v-if="deleteDialogOpen"
        id="confirm-dialog"
        class="border border-danger rounded mt-1 p-2 pl-4"
      >
        <span
          id="exclamation"
          class="text-danger"
        >
          !
        </span>
        <b-row class="no-gutters">
          <b-col
            md="8"
            class="pr-md-2"
          >
            <span id="confirm-message">
              There are currently {{ peopleWithSkill }} persons that have this skill in their CV.
              Are you sure you want to delete the skill?
            </span>
          </b-col>
          <b-col md="4">
            <b-row class="no-gutters mt-md-3">
              <b-col
                cols="6"
              >
                <b-button
                  id="cancel-confirm-delete-btn"
                  @click="closeConfirmDialog"
                >
                  Cancel
                </b-button>
              </b-col>
              <b-col
                cols="6"
              >
                <b-button
                  id="confirm-delete-btn"
                  variant="danger"
                  @click="confirmDelete"
                >
                  Delete
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
      <div
        id="error-message"
        class="text-danger"
      >
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import LoadingSpinner from '../helpers/LoadingSpinner'
import { mapActions } from 'vuex'

export default {
  components: {
    vSelect,
    LoadingSpinner
  },
  props: {
    skill: Object,
    skillCategories: Object,
    peopleWithSkill: Number,
    close: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      name: this.skill.name,
      description: this.skill.description,
      selectedSkillCategory: this.skillCategories[this.skill.SkillCategoryId],
      deleteDialogOpen: false,
      loading: false,
      categoryNotSelected: false,
      errorMessage: ''
    }
  },
  computed: {
    skillCategoryOptions () {
      return Object.values(this.skillCategories)
    },
    categoryRequired () {
      return this.categoryNotSelected ? 'Category is required' : ''
    }
  },
  methods: {
    ...mapActions(['updateSkill', 'deleteSkill']),
    submit (evt) {
      evt.preventDefault()
      if (this.selectedSkillCategory) {
        const skill = {
          id: this.skill.id,
          name: this.name,
          description: this.description,
          SkillCategoryId: this.selectedSkillCategory.id
        }
        this.submitUpdatedSkill(skill)
      } else {
        this.categoryNotSelected = true
      }
    },
    closeConfirmDialog () {
      this.deleteDialogOpen = false
    },
    openDeleteConfirmation (evt) {
      this.deleteDialogOpen = true
    },
    resetErrorMessage () {
      this.errorMessage = ''
    },
    async submitUpdatedSkill (skill) {
      try {
        this.resetErrorMessage()
        this.loading = true
        await this.updateSkill(skill)
        this.close()
      } catch (error) {
        this.loading = false
        this.errorMessage = `Error updating skill: \n ${error.message}`
      }
    },
    async confirmDelete () {
      try {
        this.resetErrorMessage()
        this.loading = true
        await this.deleteSkill(this.skill.id)
        this.close()
      } catch (error) {
        this.loading = false
        this.errorMessage = `Error deleting skill: \n ${error.message}`
      }
    }
  }
}
</script>

<style scoped>
  #confirm-dialog {
    position: relative;
  }
  #exclamation {
    font-size: 55px;
    left: 5px;
    position: absolute;
    top: -5px;
  }
</style>
