<template>
    <div v-on:click="seen = !seen"> 
        <table>
            <tr>
                <th v-for="(avaibility, key) in schedule.avaibilityByDay" :key="key">
                    {{ key }}
                </th>
            </tr>
            <tr>
                <td v-for="(avaibility, key) in schedule.avaibilityByDay" :key="key">
                    {{ avaibility }}
                </td>
            </tr>
        </table>
        <p v-if="seen" />
        <span v-if="seen">{{ schedule.description }}</span>
    </div>
</template>

<script>
export default {
  name: 'UserSchedule',
  data () {
    return {
      seen: false
    }
  },
  props: {
    'schedule': Object
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #dddddd;
}

</style>
