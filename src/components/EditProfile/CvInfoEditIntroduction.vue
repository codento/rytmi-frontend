<template>
  <b-row class="my-2">
    <b-col cols="12">
      <h2>Employee introduction</h2>
    </b-col>
    <b-col
      v-for="lang in [{key: 'fi', label: 'Finnish'}, {key: 'en', label: 'English'}]"
      :key="'edit-introduction-elem-' + lang.key"
      sm="6"
    >
      <small>Introduction for CV main page (in {{ lang.label }})</small>
      <b-textarea
        :id="'input-introduction-' + lang.key"
        v-model="editedIntroductions[lang.key]"
        placeholder="Introduction for CV main page"
        type="text"
        rows="6"
        :state="introductionIsValid(editedIntroductions[lang.key])"
      />
      <b-form-invalid-feedback
        :id="'input-introduction-feedback-' + lang.key"
        class="text-left"
      >
        <div v-if="editedIntroductions[lang.key].length === 0">
          Introduction cannot be empty
        </div>
        <div v-else>
          Maximum number of characters reached ({{ editedIntroductions[lang.key].length }}/{{ maxIntroductionLength }})
        </div>
      </b-form-invalid-feedback>
      <div v-if="introductionIsValid(editedIntroductions[lang.key])">
        <p class="text-right text-success">
          {{ maxIntroductionLength - editedIntroductions[lang.key].length }}/{{ maxIntroductionLength }}
        </p>
      </div>
    </b-col>
    <b-col cols="12">
      <b-button
        size="sm"
        class="mb-4"
        variant="success"
        type="submit"
        :disabled="!introductionIsValid(editedIntroductions.fi) || !introductionIsValid(editedIntroductions.en)"
        @click.prevent="callUpdateProfileAction()"
      >
        Submit changes
      </b-button>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CvInfoEditIntroduction',
  props: {
    profile: Object
  },
  data () {
    return {
      maxIntroductionLength: 360,
      editedIntroductions: {
        fi: this.profile.introduction ? this.profile.introduction.fi : '',
        en: this.profile.introduction ? this.profile.introduction.en : ''
      }
    }
  },
  computed: {},
  methods: {
    ...mapActions(['updateProfile']),
    introductionIsValid: function (introduction) {
      return introduction.length > 0 && introduction.length <= this.maxIntroductionLength
    },
    async callUpdateProfileAction () {
      const editedProfile = Object.assign({}, this.profile)
      editedProfile.introduction = {}
      editedProfile.introduction.fi = this.editedIntroductions.fi
      editedProfile.introduction.en = this.editedIntroductions.en
      try {
        await this.updateProfile(editedProfile)
        this.$toasted.global.rytmi_success({
          message: 'Profile CV introduction updated.'
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
