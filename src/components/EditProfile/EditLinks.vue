<template>
  <div>
    <br>
    <h5>Edit Links:</h5>
    <b-card id="editLinks">
      <div v-show="profileHasLinks">
        <ul>
          <li
            v-for="(link, idx) in profile.links"
            :key="idx"
            style="padding-right:20px"
          >
            <span
              name="remove-link"
              style="color:red; padding-right:10px; cursor:pointer"
              @click="removeLink(link)"
            >X</span>
            <a
              :href="link"
              target="_blank"
            >{{ link }}</a>
          </li>
        </ul>
      </div>
      <b-form @submit.prevent="addLink">
        <b-form-group
          id="addLinks"
          label-cols-sm="3"
          label="Add Links:"
          label-for="linkInput"
        >
          <b-form-input
            id="linkInput"
            v-model="linkInput"
            type="url"
            pattern="(https?)://(-\.)?([^\s/?\.#-]+\.?)+(/[^\s]*)?$"
            required
            @keydown.native="clearErrors"
          />
          <div
            v-if="errorDetails.length > 0"
            class="alert alert-warning"
          >
            <ApiErrorDetailsPanel :error-details="errorDetails" />
          </div>
        </b-form-group>
        <b-button
          id="add"
          variant="primary"
          type="submit"
        >
          Add
        </b-button>
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
  computed: {
    profileHasLinks () {
      return this.profile.links && this.profile.links.length > 0
    }
  },
  methods: {
    ...mapActions(['updateProfile']),
    removeLink: function (link) {
      const links = this.profile.links.filter(l => link !== l)
      this.submitChanges(links)
    },
    clearErrors () {
      this.errorDetails = []
    },
    addLink () {
      this.clearErrors()
      if (this.linkInput && !this.linkExists(this.linkInput)) {
        const links = this.profile.links ? this.profile.links.slice() : []
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
        this.$emit('profileUpdated')
        this.$toasted.global.rytmi_success({
          message: 'Links updated.'
        })
      } catch (error) {
        if (Array.isArray(error.details)) {
          this.errorDetails = error.details
        } else {
          this.errorDetails.push(error.details)
        }
      }
    },
    linkExists (link) {
      if (!this.profile.links) {
        return false
      }
      return this.profile.links.includes(link)
    }
  }
}
</script>

<style scoped>
li {
  list-style-type: none;
}
</style>
