<template>
  <div>
    <b-form-group
      label="Filter by name"
    >
    <b-form-input v-model="filterValue" />
    </b-form-group>

    <b-list-group
      v-for="(user, idx) in usersAsList"
      :key="idx"
    >
      <b-list-group-item
        :active="isUserSelected(user.id)"
        @click="selectUser(user.id)"
      >
        {{ user.firstName + ' ' + user.lastName }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import { sortBy } from 'lodash'

export default {
  props: {
    users: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      filterValue: '',
      selectedUserId: 50
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
