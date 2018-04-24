<template>
  <div class="animated fadeIn">
      <h1>Proficiencies</h1>
      <hr />
      <b-row>
        <b-col class="col-sm-5 col-md-5">
          <skill-form :profileId="profileId" />
        </b-col>
        <b-col class="col-sm-7 col-md-7">
          <b-table
            :items="skillsByProfileId(profileId)"
            :fields="fields"
            fixed
            caption-top
          >
            <template slot="table-caption">
              Current proficiencies
            </template>
            <template slot="skillId" slot-scope="skillId">
              {{skillById(skillId.value).name}}
            </template>
            <template slot="knows" slot-scope="knows">
              <b-progress
                :value="knows.value"
                max="5"
                show-value
              />
            </template>
            <template slot="wantsTo" slot-scope="wantsTo">
              <b-progress
                :value="wantsTo.value"
                max="5"
                show-value
              />
            </template>
            <template slot="remove" slot-scope="remove">
              <b-btn size="sm" variant="danger" @click.stop="removeSkillFromProfile(remove.item.id)">Remove</b-btn>
            </template>
          </b-table>
        </b-col>
      </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SkillForm from './SkillForm'
import SkillCard from './SkillCard'

export default {
  name: 'EditSkills',
  props: {
    'profileId': Number
  },
  data () {
    return {
      fields: [
        { key: 'skillId', label: 'Proficiency' },
        { key: 'knows', label: 'Level' },
        { key: 'wantsTo', label: 'Willingness' },
        { key: 'remove', label: ' ' }
      ]
    }
  },
  components: {
    SkillForm,
    SkillCard
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillById',
      'skillsByProfileId'
    ])
  },
  methods: {
    ...mapActions([
      'removeProfileSkill'
    ]),
    removeSkillFromProfile (skillId) {
      const confirmation = confirm('Are you sure?')
      if (confirmation) {
        this.removeProfileSkill({profileId: this.profileId, id: skillId})
      }
    }
  }
}
</script>

<style scoped />
