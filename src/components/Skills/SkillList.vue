<template>
  <div>
    <h1>Skills</h1>
    <b-row class="my-2">
      <b-col
        cols="12"
        class="my-4"
      >
        <b-button
          id="add-skill-btn"
          variant="primary"
          class="mx-2"
          @click.prevent="openEditSkillModal()"
        >
          Add new skill
        </b-button>
        <b-button
          v-if="isAdmin"
          id="manage-categories-btn"
          variant="primary"
          class="mx-2"
          @click.prevent="openEditCategoryModal()"
        >
          Manage skill categories
        </b-button>
      </b-col>
    </b-row>
    <b-row
      class="my-2"
      align-v="end"
    >
      <b-col
        cols="12"
        md="4"
      >
        <b-input
          id="skill-name-filter-input"
          v-model="filterValues['name']"
          placeholder="Search all skills"
          class="mr-2"
        />
      </b-col>
      <b-col
        cols="12"
        md="4"
      >
        <small
          for="skill-category-filter-input"
        >
          Skill category
        </small>
        <v-select
          id="skill-category-input"
          v-model="filterValues['skillCategoryName']"
          :options="filterOptions['skillCategoryName']"
          multiple
        />
      </b-col>
    </b-row>
    <b-table
      id="skill-list-table"
      :items="tableItems"
      :fields="fields"
      hover
    >
      <template
        slot="actions"
        slot-scope="data"
      >
        <b-button-group>
          <b-btn
            :id="'edit-skill-item-btn-' + data.index"
            size="sm"
            class="mr-1 table-button"
            variant="success"
            @click="openEditSkillModal(data.item)"
          >
            Edit
          </b-btn>
          <b-btn
            :id="'remove-skill-item-btn-' + data.index"
            name="remove"
            size="sm"
            class="mr-1 table-button"
            variant="danger"
            @click.stop="confirmDelete(data.item)"
          >
            Remove
          </b-btn>
        </b-button-group>
      </template>
    </b-table>
    <b-modal
      ref="edit-skill-modal"
      hide-header
      hide-footer
      @hidden="resetSelectedSkill"
    >
      <SkillListEditSkill
        :skill="selectedSkill"
        :close="closeEditSkillModal"
      />
    </b-modal>
    <b-modal
      ref="edit-skill-category-modal"
      hide-header
      hide-footer
    >
      <SkillListAdminPanel :close="closeEditCategoryModal" />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { orderBy } from 'lodash'
import vSelect from 'vue-select'
import SkillListEditSkill from './SkillListEditSkill'
import SkillListAdminPanel from './SkillListAdminPanel'

export default {
  name: 'SkillsList',
  components: {
    SkillListEditSkill,
    SkillListAdminPanel,
    vSelect
  },
  props: {
    skillList: {
      type: Array
    }
  },
  data () {
    return {
      selectedSkill: null,
      fields: [
        {
          key: 'name',
          sortable: true
        },
        {
          key: 'skillCategoryName',
          label: 'Skill Category',
          sortable: true
        },
        {
          key: 'description',
          sortable: false
        },
        {
          key: 'createdAt',
          sortable: true
        },
        {
          key: 'updatedAt',
          sortable: true
        },
        {
          key: 'actions',
          sortable: false
        }
      ],
      filterValues: {
        name: undefined,
        skillCategoryName: [],
        skillGroupName: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'skillProfiles',
      'isAdmin',
      'skillFilter'
    ]),
    tableItems () {
      const orderedSkills = orderBy(this.skillList, [skill => skill.name.toLowerCase()], ['asc'])
      return orderedSkills.map(skill => {
        const formattedDates = {
          createdAt: this.$options.filters.dateFilter(skill.createdAt),
          updatedAt: this.$options.filters.dateFilter(skill.updatedAt)
        }
        return { ...skill, ...formattedDates }
      }).filter(skill => {
        // Filter data based on user selection/input
        return Object.keys(this.filterValues).every(key => {
          if (this.filterValues[key] && this.filterValues[key].length > 0) {
            // Input text field
            if (key === 'name') {
              return skill[key].toLowerCase().includes(this.filterValues[key])
            }
            // Dropdown options
            return this.filterValues[key].includes(skill[key])
          }
          return true
        })
      })
    },
    numberOfProfilesWithSelectedSkill () {
      if (this.selectedSkill) {
        return this.skillProfiles.filter(profile => profile.skillId === this.selectedSkill.id).length
      }
      return 0
    },
    filterOptions () {
      const options = {}
      Object.keys(this.filterValues).forEach(key => {
        const values = this.skillList.map(item => item[key])
        // Unique values sorted alphabetically
        options[key] = Array.from(new Set(values)).sort()
      })
      return options
    }
  },
  methods: {
    ...mapActions(['deleteSkill', 'updateSkillFilter']),
    openEditSkillModal (item) {
      if (item) {
        this.selectedSkill = { ...item }
      } else {
        this.selectedSkill = { id: null }
      }
      this.$refs['edit-skill-modal'].show()
    },
    resetSelectedSkill () {
      this.selectedSkill = { id: null }
    },
    closeEditSkillModal () {
      this.resetSelectedSkill()
      this.$refs['edit-skill-modal'].hide()
    },
    openEditCategoryModal (item) {
      this.$refs['edit-skill-category-modal'].show()
    },
    closeEditCategoryModal () {
      this.$refs['edit-skill-category-modal'].hide()
    },
    confirmDelete (item) {
      this.selectedSkill = item
      const message = this.numberOfProfilesWithSelectedSkill > 0
        ? `There are currently ${this.numberOfProfilesWithSelectedSkill} ` +
        'persons who have this skill in their CV. ' +
        `Are you sure you want to delete skill ${item.name}?`
        : `Are you sure you want to delete skill ${item.name}?`
      const confirmation = confirm(message)
      if (confirmation) {
        this.resetSelectedSkill()
        this.callDeleteSkillAction(item.id)
      }
    },
    async callDeleteSkillAction (skillId) {
      try {
        await this.deleteSkill(skillId)
        this.updateSkillFilter(this.skillFilter.filter(skill => skill.id !== skillId))
        this.$toasted.global.rytmi_success({
          message: 'Skill removed'
        })
      } catch (error) {
        this.$toasted.global.rytmi_error({
          message: error
        })
      }
    }
  }
}
</script>

<style scoped>
#skill-list-table td:nth-child(3), #skill-list-table th:nth-child(3) {
  width: 40%;
}
</style>
