<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col>
        <UserProfileCard :profile="getProfile"/>
      </b-col>
      <b-col>
        <b-card header='Taidot' >
          <div class="row mb-1">
            <SkillRow class="col-sm-6"  v-for='skill in sortSkills' :name="skill.name" :proficiency="skill.knows" :key='skill.id' />
          </div>
        </b-card>
        <b-card header='Työkokemus'>
          <ProjectRow v-for='project in projects' :project="project"  :key="project.projectId"/>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import SkillRow from '../components/SkillRow'
import ProjectRow from '../components/ProjectRow'
import UserProfileCard from '../components/UserProfileCard'

export default {
  name: 'Profile',
  computed: {
    ...mapGetters([
      'profileById',
      'profiles',
      'skillsById'
    ]),
    getProfile () {
      return this.profileById(this.$route.params.id)
    },
    getSkills () {
      return this.skillsById(this.$route.params.id)
    },
    sortSkills (param) {
      return this.$lodash.orderBy(this.skills, ['wantsTo', 'name'], ['desc', 'asc']) // TODO Figure out how lodash should be handled in tests
    }
  },
  components: {
    SkillRow,
    ProjectRow,
    UserProfileCard
  },
  data () {
    return {
      skills: [
        {
          name: 'Vue.js',
          knows: 0,
          wantsTo: 2,
          id: 7
        },
        {
          name: 'Node.js',
          knows: 2,
          wantsTo: 1,
          id: 8
        },
        {
          name: 'JavaScript',
          knows: 2,
          wantsTo: 1,
          id: 0
        },
        {
          name: 'React.js',
          knows: 5,
          wantsTo: 2,
          id: 1
        },
        {
          name: 'CoffeeScript',
          knows: 4,
          wantsTo: 1,
          id: 2
        },
        {
          name: 'Angular v.4',
          knows: 3,
          wantsTo: 2,
          id: 3
        },
        {
          name: 'TypeScript',
          knows: 3,
          wantsTo: 1,
          id: 4
        },
        {
          name: 'Java',
          knows: 4,
          wantsTo: 0,
          id: 5
        },
        {
          name: 'Python',
          knows: 3,
          wantsTo: 2,
          id: 6
        }
      ],
      projects: [
        {
          name: 'Teuvon telakoneet',
          title: 'Arkkitehti',
          projectID: '123',
          description: 'Spicy jalapeno venison landjaeger doner short loin, boudin pork loin swine. Strip steak jerky fatback tail. Fatback brisket landjaeger, kielbasa swine capicola venison ham boudin short loin cow sirloin. T-bone prosciutto leberkas sausage capicola kevin porchetta, brisket beef ribs pork belly meatloaf shankle drumstick. Beef venison brisket fatback prosciutto tail jerky shankle boudin pancetta tenderloin biltong. Spare ribs brisket shank jowl jerky. Biltong pig pork belly pork alcatra venison.',
          startDate: '19/10/2015',
          endDate: '20/10/2017'
        },
        {
          name: 'Jake järkkääävä',
          projectID: '123',
          title: 'Siivooja',
          description: 'It’s about making placeholder text great again. That’s what people want, they want placeholder text to be great again. That other text? Sadly, it’s no longer a 10. This placeholder text is gonna be HUGE. Look at these words. Are they small words? And he referred to my words - if they\'re small, something else must be small. I guarantee you there\'s no problem, I guarantee.',
          startDate: '29/10/2015',
          endDate: '20/11/2017'
        },
        {
          name: 'Ramin riemut',
          projectID: '123',
          title: 'Iso Kiho',
          description: 'Well, the way they make shows is, they make one show. That show\'s called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they\'re going to make more shows. Some pilots get picked and become television programs. Some don\'t, become nothing. She starred in one of the ones that became nothing.',
          startDate: '19/9/2016',
          endDate: '20/10/2016'
        },
        {
          name: 'Heikki Hipsterin Kahvila',
          projectID: '123',
          title: 'Barista',
          description: 'Lyft mixtape air plant raw denim, iceland single-origin coffee semiotics jean shorts man braid live-edge bespoke forage. Trust fund whatever cold-pressed cred, chia hammock butcher single-origin coffee actually truffaut ramps edison bulb neutra vice XOXO. Fanny pack seitan shaman thundercats gastropub butcher hexagon narwhal microdosing fam PBR&B squid. Woke brooklyn literally, ennui paleo street art mlkshk truffaut VHS celiac wolf. Taiyaki neutra palo santo stumptown chillwave meggings authentic brunch mixtape. Yr lomo ugh actually, viral copper mug food truck pour-over lumbersexual seitan helvetica knausgaard hammock austin. Tacos franzen slow-carb blue bottle tumblr literally organic godard next level.',
          startDate: '19/9/2015',
          endDate: '20/9/2015'
        }
      ]
    }
  },
  methods: {
    getKnowledge (knows) {
      switch (knows) {
        case 1:
          return { text: 'Alkeet', class: 'text-warning' }
        case 2:
          return { text: 'Duunari', class: 'text-primary' }
        case 3:
          return { text: 'Seniori', class: 'text-primary' }
        case 4:
          return { text: 'Arkkitehti', class: 'text-success' }
        case 5:
          return { text: 'Guru', class: 'text-success' }
        default:
          return { text: 'Ei osaa', class: 'text-warning' }
      }
    },
    getWants (wantsTo) {
      switch (wantsTo) {
        case 0:
          return { text: 'En halua tehdä', class: 'text-danger' }
        case 1:
          return { text: 'Voin tehdä varauksella', class: 'text-primary' }
        case 2:
          return { text: 'Haluan tehdä', class: 'text-success' }
        default:
          return { text: 'Arvoa ei ole annettu', class: 'text-warning' }
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
