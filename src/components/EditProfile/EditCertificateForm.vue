<template>
  <b-form
    id="edit-certificate-form"
  >
    <h3>Add a new certificate</h3>
    <hr>
    <b-row>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="name-fi">Sertifikaatin nimi (suomeksi) *</small>
          <b-input
            id="name-fi"
            v-model="editedCertificate.fi.name"
            type="text"
            placeholder="Sertifikaatin nimi suomeksi"
            :state="inputStates.nameFi"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="name-en">Certificate name (in English) *</small>
          <b-input
            id="name-en"
            v-model="editedCertificate.en.name"
            type="text"
            placeholder="Name of the certificate in English"
            :state="inputStates.nameEn"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="description-fi">Sertifikaatin kuvaus (suomeksi)</small>
          <b-textarea
            id="description-fi"
            v-model="editedCertificate.fi.description"
            type="text"
            rows="2"
            class="form-control"
            placeholder="Lisätietoa sertifikaatista, jos tarpeen."
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="description-en">Certificate description (in English)</small>
          <b-textarea
            id="description-en"
            v-model="editedCertificate.en.description"
            type="text"
            rows="2"
            class="form-control"
            placeholder="Additional information about the certificate, if needed."
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
            v-model="editedCertificate.year"
            type="number"
            placeholder="Year of acquiring the certificate"
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
          id="save"
          class="pull-right"
          variant="success"
          @click="save()"
        >
          Save and close
        </b-btn>
        <b-btn
          id="cancel"
          class="pull-right"
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
  name: 'EditCertificateForm',
  props: {
    certificate: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      validated: false,
      editedCertificate: cloneDeep(this.certificate)
    }
  },
  computed: {
    inputStates () {
      return {
        nameFi: this.validated ? this.editedCertificate.fi.name.length > 0 : undefined,
        nameEn: this.validated ? this.editedCertificate.en.name.length > 0 : undefined,
        year: this.validated ? this.editedCertificate.year >= 1970 && this.editedCertificate.year <= new Date().getFullYear() : undefined
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
        this.$emit('submit', this.editedCertificate)
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
