<template>
  <b-form
    id="edit-certificate-or-other-form"
  >
    <h3>Add a new certificate or other validation of expertise</h3>
    <hr>
    <b-row>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="name-fi">Sertifikaatin tai muun nimi (suomeksi) *</small>
          <b-input
            id="name-fi"
            v-model="editedCertificateOrOther.fi.name"
            type="text"
            placeholder="Nimi suomeksi"
            :state="inputStates.nameFi"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="name-en">Certificate's / Other similar item's name (in English) *</small>
          <b-input
            id="name-en"
            v-model="editedCertificateOrOther.en.name"
            type="text"
            placeholder="Name in English"
            :state="inputStates.nameEn"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="description-fi">Kuvaus (suomeksi)</small>
          <b-textarea
            id="description-fi"
            v-model="editedCertificateOrOther.fi.description"
            type="text"
            rows="2"
            class="form-control"
            placeholder="Lisätietoa, jos tarpeen"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="description-en">Description (in English)</small>
          <b-textarea
            id="description-en"
            v-model="editedCertificateOrOther.en.description"
            type="text"
            rows="2"
            class="form-control"
            placeholder="Additional information, if needed"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group invalid-feedback="Year is required and must be after 1970 and can't be in the future.">
          <small for="name-fi">Acquisition year *</small>
          <b-input
            id="year"
            v-model="editedCertificateOrOther.year"
            type="number"
            placeholder="Year of acquiring the certificate or similar item"
            :state="inputStates.year"
            :min="1970"
            :max="new Date().getFullYear()"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-btn
          id="save-certificate-or-other"
          class="float-right"
          variant="success"
          @click="save()"
        >
          Save and close
        </b-btn>
        <b-btn
          id="close-certificate-or-other-form"
          class="float-right"
          variant="light"
          @click="cancel()"
        >
          Cancel
        </b-btn>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { cloneDeep } from 'lodash'

export default {
  name: 'EditCertificateOrOtherForm',
  props: {
    certificateOrOther: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      validated: false,
      editedCertificateOrOther: cloneDeep(this.certificateOrOther)
    }
  },
  computed: {
    inputStates () {
      return {
        nameFi: this.validated ? this.editedCertificateOrOther.fi.name.length > 0 : undefined,
        nameEn: this.validated ? this.editedCertificateOrOther.en.name.length > 0 : undefined,
        year: this.validated ? this.editedCertificateOrOther.year >= 1970 && this.editedCertificateOrOther.year <= new Date().getFullYear() : undefined
      }
    },
    formIsValid () {
      const stateArray = []
      for (let entry of Object.entries(this.inputStates)) {
        stateArray.push(entry[1])
      }
      return stateArray.every(item => item)
    }
  },
  methods: {
    save () {
      this.validated = true
      if (this.formIsValid) {
        this.$emit('submit', this.editedCertificateOrOther)
      }
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
