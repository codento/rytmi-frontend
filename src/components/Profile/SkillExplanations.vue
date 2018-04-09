<template>
  <b-row style="width:100%">
    <b-col>
      <h4>Osaaminen</h4>
      <b-row v-for="value in Object.keys(knowDesc)"
        :key=value>
        <b-col>{{ value }}: {{ knowDesc[value] }}</b-col>
      </b-row>
    </b-col>
    <b-col>
      <h4>Halukkuus</h4>
      <b-row v-for="value in Object.keys(wantDesc)"
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
    knowDesc: Object,
    wantDesc: Object
  }
}
</script>

<style lang="css" />
