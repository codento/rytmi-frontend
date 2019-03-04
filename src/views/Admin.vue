<template>
  <b-container>
    <h2>Admin</h2>
    <b-row>
      <b-col sm="12" md="6">
        <UserList :users="profiles"/>
      </b-col>
      <b-col sm="12" md="6">selected profile</b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import UserList from '@/components/Admin/UserList'

export default {
  components: {
    UserList
  },
  computed: {
    ...mapGetters(['profiles'])
  }
}
</script>
