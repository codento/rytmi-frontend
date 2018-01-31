<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col>
        <UserProfileCard :basicInfo="basicInfo"/>
      </b-col>
      <b-col>
        <b-card header='Taidot <i class="float-right fa fa-edit"></i>' >
          <div class="row mb-1">
            <SkillRow class="col-sm-6"  v-for='skill in sortSkills' :name="skill.name" v-bind:item="skill" :proficiency="skill.knows" :key='skill.id' />
          </div>
        </b-card>
        <b-card header='Työkokemus'>
          <ProjectRow v-for='project in projects' :project="project" :projectName="project.projectName" :key="project.projectId"/>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import SkillRow from '../components/SkillRow'
import ProjectRow from '../components/ProjectRow'
import UserProfileCard from '../components/UserProfileCard'

export default {
  name: 'Profile',
  computed: {
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
      basicInfo: {
        name: 'Nicholas Cage',
        title: 'Actor',
        mail: 'jari.sillanpaa@codento.com',
        phone: '050 555 5555',
        aboutMe: 'Bacon ipsum dolor amet salami ham hock rump pork capicola short ribs ground round cupim landjaeger sirloin buffalo t-bone. Sirloin alcatra ham frankfurter t-bone pig spare ribs. Buffalo flank salami rump bacon short ribs meatball sirloin jowl alcatra. Tenderloin kevin venison landjaeger, tongue kielbasa ribeye prosciutto chicken salami pork chop doner ham hock pork belly pig.',
        photo: 'https://baconmockup.com/300/200',
        accounts: [
          {type: 'facebook', address: 'linkedin.com/testprofile'},
          {type: 'linkedIn', address: 'linkedin.com/testprofile'},
          {type: 'twitter', address: 'linkedin.com/testprofile'}]
      },
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
          projectName: 'Teuvon telakoneet',
          title: 'Arkkitehti',
          projectID: '123',
          projectDescription: 'Spicy jalapeno venison landjaeger doner short loin, boudin pork loin swine. Strip steak jerky fatback tail. Fatback brisket landjaeger, kielbasa swine capicola venison ham boudin short loin cow sirloin. T-bone prosciutto leberkas sausage capicola kevin porchetta, brisket beef ribs pork belly meatloaf shankle drumstick. Beef venison brisket fatback prosciutto tail jerky shankle boudin pancetta tenderloin biltong. Spare ribs brisket shank jowl jerky. Biltong pig pork belly pork alcatra venison.',
          projectStartDate: '19/10/2015',
          projectEndDate: '20/10/2017'
        },
        {
          projectName: 'Jake järkkääävä',
          projectID: '123',
          title: 'Siivooja',
          projectDescription: 'It’s about making placeholder text great again. That’s what people want, they want placeholder text to be great again. That other text? Sadly, it’s no longer a 10. This placeholder text is gonna be HUGE. Look at these words. Are they small words? And he referred to my words - if they\'re small, something else must be small. I guarantee you there\'s no problem, I guarantee.',
          projectStartDate: '29/10/2015',
          projectEndDate: '20/11/2017'
        },
        {
          projectName: 'Ramin riemut',
          projectID: '123',
          title: 'Iso Kiho',
          projectDescription: 'Well, the way they make shows is, they make one show. That show\'s called a pilot. Then they show that show to the people who make shows, and on the strength of that one show they decide if they\'re going to make more shows. Some pilots get picked and become television programs. Some don\'t, become nothing. She starred in one of the ones that became nothing.',
          projectStartDate: '19/9/2016',
          projectEndDate: '20/10/2016'
        },
        {
          projectName: 'Heikki Hipsterin Kahvila',
          projectID: '123',
          title: 'Barista',
          projectDescription: 'Lyft mixtape air plant raw denim, iceland single-origin coffee semiotics jean shorts man braid live-edge bespoke forage. Trust fund whatever cold-pressed cred, chia hammock butcher single-origin coffee actually truffaut ramps edison bulb neutra vice XOXO. Fanny pack seitan shaman thundercats gastropub butcher hexagon narwhal microdosing fam PBR&B squid. Woke brooklyn literally, ennui paleo street art mlkshk truffaut VHS celiac wolf. Taiyaki neutra palo santo stumptown chillwave meggings authentic brunch mixtape. Yr lomo ugh actually, viral copper mug food truck pour-over lumbersexual seitan helvetica knausgaard hammock austin. Tacos franzen slow-carb blue bottle tumblr literally organic godard next level.',
          projectStartDate: '19/9/2015',
          projectEndDate: '20/9/2015'
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
