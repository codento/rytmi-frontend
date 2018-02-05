<template>
  <div class="animated fadeIn">
    <b-form @submit="onSubmit" @reset="onReset"  v-if="show">
      <b-form-group
          horizontal
          id="firstNameLabel"
          label="Firstname:"
          label-for="firstName">
        <b-form-input 
          id="firstNameInput"
          type="text"
          v-model="profile.firstName"
          required
          placeholder="Enter firstName">
        </b-form-input>
      </b-form-group>
      <b-form-group
          horizontal 
          id="lastNameLabel"
          label="Lastname:"
          label-for="lastNameInput">
        <b-form-input 
            id="lastNameInput"
            type="text"
            v-model="profile.lastName"
            required
            placeholder="Enter lastName">
        </b-form-input>
      </b-form-group>
       <b-form-group 
          horizontal
          id="emailLabel"
          label="Email:"
          label-for="emailInput">
        <b-form-input 
            id="emailInput"
            type="text"
            v-model="profile.email"
            required
            placeholder="Enter Email">
        </b-form-input>
      </b-form-group>
       <b-form-group 
          id="PhonenumberLabel" 
          horizontal
          label="Phonenumber:"
          label-for="PhonenumberInput">
        <b-form-input 
            id="PhonenumberInput"
            type="text"
            v-model="profile.phone"
            required
            placeholder="Enter Phonenumber">
          </b-form-input>
        </b-form-group >
        <b-form-group 
            id="description" 
            horizontal
            label="Description:"
            label-for="descriptionInput">
        <b-form-input 
            id="descriptionInput"
            :rows="3"
            type="text"
            v-model="profile.description"
            placeholder="Short description">
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Peruuta</b-button>
    </b-form>
  </div>
</template>

<script>
import SkillCard from '../components/SkillCard'
import skillUtils from '../utils/skillUtils'
export default {
  name: 'EditProfile',
  components: {
    SkillCard
  },
  methods: {
    deleteSkill (skill) {
      this.profile.skills.splice(skill, 1)
    },
    addNew () {
      const skills = skillUtils.getSkills()
      this.profile.skills.push(
        {
          name: skills[Math.floor(Math.random() * skills.length)],
          knows: Math.floor(Math.random() * 5),
          wantsTo: Math.floor(Math.random() * 3) + 1,
          id: this.profile.skills.length + 1})
    },
    onSubmit (evt) {
      evt.preventDefault()
      alert(JSON.stringify(this.profile))
    },
    info (item, index, button) {
      alert(JSON.stringify(item))
    },
    onReset (evt) {
      evt.preventDefault()
      this.profile.email = ''
      this.profile.firstName = ''
      this.profile.lastName = null
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    }
  },
  data () {
    return {
      show: true,
      profile: {
        id: 0,
        firstName: 'Nicholas',
        lastName: 'Cage',
        title: 'Actor',
        email: 'jari.sillanpaa@codento.com',
        phone: '050 555 5555',
        description: 'Nori grape silver beet broccoli kombu beet greens fava bean potato quandong celery. Bunya nuts black-eyed pea prairie turnip leek lentil turnip greens parsnip. Sea lettuce lettuce water chestnut eggplant winter purslane fennel azuki bean earthnut pea sierra leone bologi leek soko chicory celtuce parsley jícama salsify. ',
        photo: 'https://baconmockup.com/300/200',
        accounts: [
          {type: 'facebook', address: 'linkedin.com/testprofile'},
          {type: 'linkedin', address: 'linkedin.com/testprofile'},
          {type: 'twitter', address: 'linkedin.com/testprofile'}
        ],
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
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.card :hover{
  background-color: hsla(34, 100%, 51%, 0.541);

}
</style>
