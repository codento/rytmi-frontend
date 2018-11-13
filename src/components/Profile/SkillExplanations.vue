<template>
  <b-row style="width:100%">
    <b-col>
      <h4>Proficiency</h4>
      <b-row
        v-for="desc in knowDesc"
        :key="desc.text">
        <b-col>{{ desc.text }}</b-col>
      </b-row>
    </b-col>
    <b-col>
      <h4>Willingness</h4>
      <b-row
        v-for="desc in wantDesc"
        :key="desc.text">
        <b-col>{{ desc.text }}</b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>

export default {
  name: 'SkillExplanations',
  props: {
    'knowDesc': Array,
    'wantDesc': Array
  }
}
</script>
