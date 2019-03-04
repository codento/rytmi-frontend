<template>
  <div>
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

export default {
  props: {
    users: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectedUserId: 50
    }
  },
  computed: {
    usersAsList () {
      return Object.keys(this.users).map(id => this.users[id])
    }
  },
  methods: {
    selectUser (id) {
      this.selectedUserId = id
    },
    isUserSelected (id) {
      return this.selectedUserId === id
    }
  }
}
</script>
