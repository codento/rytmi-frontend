<template>
  <b-row style="width:100%">
    <b-col>
      <h4>Osaaminen</h4>
      <b-row v-for="value in knowValues"
        :key=value>
        <b-col>{{ value }}: {{ knowDesc[value] }}</b-col>
      </b-row>
    </b-col>
    <b-col>
      <h4>Halukkuus</h4>
      <b-row v-for="value in wantValues"
        :key=value>
        <b-col>{{ value }}: {{ wantDesc[value] }}</b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>

export default {
  name: 'SkillExplanations',
  props: {
    'knowDesc': Object,
    'wantDesc': Object
  },
  computed: {
    wantValues: function () {
      return Object.keys(this.wantDesc)
    },
    knowValues: function () {
      return Object.keys(this.knowDesc)
    }
  }
}
</script>
