<template>
  <div>
    <br>
    <h5>Edit Links:</h5>
    <b-card id="editLinks">
      <div v-show="profile.links.length > 0">
        <ul>
          <li
            v-for="(link, idx) in profile.links"
            :key="idx"
            style="padding-right:20px"><span
              style="color:red; padding-right:10px; cursor:pointer"
              @click="removeLink(link)">X</span>
            <a
              :href="link"
              target="_blank">{{ link }}</a>
          </li>
        </ul>
      </div>
      <b-form @submit.prevent="addLink">
        <b-form-group
          id="addLinks"
          horizontal
          label="Add Links:"
          label-for="linkInput"
        >
          <b-form-input
            id="linkInput"
            v-model="linkInput"
            type="url"
            required
            @keydown.native="clearErrors"
          />
          <div
            v-if="errorDetails.length > 0"
            class="alert alert-warning">
            <ApiErrorDetailsPanel :error-details="errorDetails" />
          </div>
        </b-form-group>
        <b-button
          id="add"
          variant="primary"
          type="submit">Add</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ApiErrorDetailsPanel from '../helpers/ApiErrorDetailsPanel'

export default {
  name: 'EditLinks',
  components: {
    ApiErrorDetailsPanel
  },
  props: {
    'profile': Object
  },
  data () {
    return {
      linkInput: '',
      errorDetails: []
    }
  },
  methods: {
    ...mapActions([
      'updateProfile'
    ]),
    removeLink: function (link) {
      const links = this.profile.links.filter(l => link !== l)
      this.submitChanges(links)
    },
    clearErrors () {
      this.errorDetails = []
    },
    addLink () {
      this.clearErrors()
      if (this.linkInput && this.findLink(this.linkInput) === -1) {
        const links = this.profile.links.slice()
        links.push(this.linkInput)
        this.submitChanges(links)
      } else {
        this.errorDetails.push('Url already exists')
      }
    },
    async submitChanges (links) {
      try {
        const profileCopy = { ...this.profile, links }
        await this.updateProfile(profileCopy)
        this.linkInput = ''
      } catch (error) {
        this.errorDetails = error.details
      }
    },
    findLink (link) {
      return this.profile.links.findIndex(l => l === link)
    }
  }
}
</script>

<style scoped>
li {
  list-style-type: none;
}
</style>
