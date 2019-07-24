<template>
  <div>
    <b-form-group
      label="Filter by name"
    >
      <b-form-input v-model="filterValue" />
    </b-form-group>
    <div class="align-middle my-1">
      Active User<CheckIcon class="check-icon mx-2" />
      Admin User<SettingsIcon class="mx-2" />
    </div>
    <b-list-group
      v-for="(user, idx) in usersAsList"
      :key="idx"
    >
      <b-list-group-item
        :active="isUserSelected(user.id)"
        name="select-user"
        class="user-list-item"
        @click="selectUser(user.id)"
      >
        {{ user.firstName + ' ' + user.lastName }}
        <CheckIcon
          v-if="user.active"
          class="check-icon"
        />
        <SettingsIcon
          v-if="user.admin"
        />
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import { sortBy } from 'lodash'
import { SettingsIcon, CheckIcon } from 'vue-feather-icons'

export default {
  components: { CheckIcon, SettingsIcon },
  props: {
    users: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      filterValue: '',
      selectedUserId: null
    }
  },
  computed: {
    usersAsList () {
      const userList = Object.keys(this.users).map(id => this.users[id]).filter(user => {
        const lowerCase = (user.firstName + ' ' + user.lastName).toLowerCase()
        return lowerCase.includes(this.filterValue.toLowerCase())
      })
      return sortBy(userList, ['firstName', 'lastName'])
    }
  },
  methods: {
    selectUser (id) {
      this.selectedUserId = id
      this.$emit('user-selected', id)
    },
    isUserSelected (id) {
      return this.selectedUserId === id
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/_variables.scss';
  .check-icon {
    color: green
  }
  .user-list-item:hover {
    cursor: pointer;
    background-color: map_get($theme-colors, 'light');
  }
  .user-list-item.active:hover {
    background-color: darken(map_get($theme-colors, 'primary'), 5);
  }
</style>
