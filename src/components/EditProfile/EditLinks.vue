<template>
  <div>
    <br>
    <h5>Edit Links:</h5>
    <b-card id="editLinks">
      <span v-for="link in profile.links" style="padding-right:20px" :key="link">
        <span v-on:click="removeLink(link)" style="color:red; padding-right:10px; cursor:pointer">X</span> {{ link }}
      </span>
        <b-form @submit="add">
        <b-form-group
          id="addLinks"
          horizontal
          label="Add Links:"
          label-for="linkInput">
          <b-form-input
            id="linkInput"
            type="text">
          </b-form-input>
        </b-form-group>
        <b-button id="add" type="submit">Add</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'EditLinks',
  props: {
    'profile': Object
  },
  methods: {
    removeLink: function (link) {
      this.profile.links.splice(this.profile.links.indexOf(link), 1)
    },
    add () {
      if (this.profile.links === null) {
        this.profile.links = []
      }
      let link = document.getElementById('linkInput').value
      if (link !== '') {
        this.profile.links.push(document.getElementById('linkInput').value)
        document.getElementById('linkInput').value = ''
      }
    }
  }
}
</script>

<style scoped>
  #add {
    display: none
  }
</style>
